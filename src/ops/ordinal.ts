import {
  annotateEffectFolder,
  annotateEffectUnfolder,
  replaceEffectFolder,
  treeAnaE,
  treeCataEffect,
  unfixTree,
  type Branch,
  type Tree,
  type TreeEffectFolder,
} from '#tree'
import * as treeF from '#treeF'
import {type TreeF} from '#treeF'
import {Effect, flow, Number, pipe, Ref} from 'effect'
import {constant} from 'effect/Function'

/**
 * Fold nodes of a tree level to their ordinal in depth-first pre-order.
 * @category fold
 * @function
 */
export const nodeOrdinalFold =
  (counter: Ref.Ref<number>) =>
  <A, E = never, R = never>(
    _: Effect.Effect<TreeF<A, number>>,
  ): Effect.Effect<number, E, R> =>
    useCounter(counter)

/**
 * Unfold nodes of a tree level to their ordinal in depth-first pre-order.
 * @category fold
 * @function
 */
export const nodeOrdinalUnfold =
  (counter: Ref.Ref<number>) =>
  <A, E = never, R = never>(
    self: Tree<A>,
  ): Effect.Effect<TreeF<number, Tree<A>>, E, R> =>
    pipe(
      counter,
      useCounter,
      Effect.map(n => pipe(self, unfixTree, treeF.mapValue(constant(n)))),
    )

/**
 * Unfold a tree level and annotate the nodes with their ordinal.
 * @category fold
 * @function
 */
export const annotateOrdinalUnfold =
  (counter: Ref.Ref<number>) =>
  <A, E = never, R = never>(
    pair: [Tree<A>, number],
  ): Effect.Effect<TreeF<[A, number], [Tree<A>, number]>, E, R> =>
    pipe(
      counter,
      nodeOrdinalUnfold,
      annotateEffectUnfolder<number, A, E, R>,
    )(pair)

/**
 * Replaces all tree nodes with their unique ordinal. The order is depth-first
 * post-order, so that the root node value is the maximum. For example a tree
 * shaped so:
 *
 *
 * ```
 *  ┬?
 *  ├─?
 *  └┬?
 *   ├─?
 *   └─?
 * ```
 *
 * Will become this tree:
 * ```
 *  ┬5
 *  ├─1
 *  └┬4
 *   ├─2
 *   └─3
 * ```
 *
 * Under the `pre` key you will find a version that does the same but in
 * depth-first pre-order.
 * @category ops
 * @function
 */
export const asOrdinal =
  (initialize: number) =>
  (self: Tree<any>): Tree<number> => {
    const counterEffect: Effect.Effect<Ref.Ref<number>> = Ref.make(initialize)

    const replace = (
      counter: Ref.Ref<number>,
    ): TreeEffectFolder<unknown, Tree<number>, never, never> =>
      replaceEffectFolder(flow(Effect.succeed, nodeOrdinalFold(counter)))

    return pipe(
      counterEffect,
      Effect.map(replace),
      Effect.flatMap(φ => treeCataEffect(φ)(self)),
      Effect.runSync,
    )
  }

asOrdinal.pre =
  (initialize: number) =>
  (self: Tree<any>): Tree<number> =>
    pipe(
      initialize,
      Ref.make,
      Effect.flatMap(counter =>
        pipe(self, treeAnaE(nodeOrdinalUnfold(counter))),
      ),
      Effect.runSync,
    )

/**
 * Annotate tree nodes with their post-order depth-first ordinal.
 *
 * Under the `pre` key you will find a version that does the same but in
 * depth-first pre-order.
 * @category ops
 * @function
 */
export const withOrdinal =
  (initialize = 1) =>
  <A>(self: Tree<A>): Tree<[A, number]> => {
    const counterEffect: Effect.Effect<Ref.Ref<number>> = Ref.make(initialize)

    const annotate =
      (counter: Ref.Ref<number>) => (self: treeF.TreeF<A, Tree<[A, number]>>) =>
        pipe(
          self,
          annotateEffectFolder<A, number>(
            flow(Effect.succeed, nodeOrdinalFold(counter)),
          ),
        )

    return pipe(
      counterEffect,
      Effect.map(annotate),
      Effect.flatMap(φ => treeCataEffect(φ)(self)),
      Effect.runSync,
    )
  }

withOrdinal.pre =
  (initialize: number) =>
  <A>(self: Tree<A>): Tree<[A, number]> =>
    pipe(
      initialize,
      Ref.make,
      Effect.flatMap(counter =>
        treeAnaE(annotateOrdinalUnfold(counter))([self, 0]),
      ),
      Effect.runSync,
    )

/**
 * A version of {@link asOrdinal} specialized for _branches_.
 * @category ops
 * @function
 */
export const asOrdinalBranch =
  (initialize: number) =>
  (self: Branch<any>): Branch<number> =>
    pipe(self, asOrdinal(initialize)) as Branch<number>

asOrdinalBranch.pre =
  (initialize: number) =>
  <A>(self: Branch<A>) =>
    pipe(self, asOrdinal.pre(initialize)) as Branch<number>

const useCounter = (ref: Ref.Ref<number>): Effect.Effect<number> =>
  pipe(
    ref,
    Ref.get,
    Effect.tap(() => Ref.update(ref, Number.increment)),
  )
