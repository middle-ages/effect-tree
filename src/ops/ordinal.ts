import {
  annotateEffectFolder,
  annotateEffectUnfolder,
  replaceEffectFolder,
  treeAnaE,
  treeCataE,
  unfixTree,
  type Branch,
  type Tree,
  type TreeEffectFolder,
} from '#tree'
import * as treeF from '#treeF'
import {type TreeF} from '#treeF'
import {flow, Number, pipe, Ref} from 'effect'
import {
  flatMap as flatMapEffect,
  map as mapEffect,
  runSync,
  succeed,
  tap,
  type Effect,
} from 'effect/Effect'
import {constant} from 'effect/Function'

export const nodeOrdinalFold =
  (counter: Ref.Ref<number>) =>
  <A, E = never, R = never>(
    _: Effect<TreeF<A, number>>,
  ): Effect<number, E, R> =>
    useCounter(counter)

export const nodeOrdinalUnfold =
  (counter: Ref.Ref<number>) =>
  <A, E = never, R = never>(
    self: Tree<A>,
  ): Effect<TreeF<number, Tree<A>>, E, R> =>
    pipe(
      counter,
      useCounter,
      mapEffect(n => pipe(self, unfixTree, treeF.mapNode(constant(n)))),
    )

//
export const annotateOrdinalUnfold =
  (counter: Ref.Ref<number>) =>
  <A, E = never, R = never>(
    pair: [Tree<A>, number],
  ): Effect<TreeF<[A, number], [Tree<A>, number]>, E, R> =>
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
 */
export const asOrdinal =
  (initialize: number) =>
  (self: Tree<any>): Tree<number> => {
    const counterEffect: Effect<Ref.Ref<number>> = Ref.make(initialize)

    const replace = (
      counter: Ref.Ref<number>,
    ): TreeEffectFolder<unknown, Tree<number>, never, never> =>
      replaceEffectFolder(flow(succeed, nodeOrdinalFold(counter)))

    return pipe(
      counterEffect,
      mapEffect(replace),
      flatMapEffect(φ => treeCataE(φ)(self)),
      runSync,
    )
  }

/** Annotate tree nodes with their post-order depth-first ordinal. */
//: Tree<[A, number]>
export const withOrdinal =
  (initialize: number) =>
  <A>(self: Tree<A>) => {
    const counterEffect: Effect<Ref.Ref<number>> = Ref.make(initialize)

    const annotate =
      (counter: Ref.Ref<number>) => (self: treeF.TreeF<A, Tree<[A, number]>>) =>
        pipe(
          self,
          annotateEffectFolder<A, number>(
            flow(succeed, nodeOrdinalFold(counter)),
          ),
        )

    return pipe(
      counterEffect,
      mapEffect(annotate),
      flatMapEffect(φ => treeCataE(φ)(self)),
      runSync,
    )
  }

asOrdinal.pre =
  (initialize: number) =>
  (self: Tree<any>): Tree<number> =>
    pipe(
      initialize,
      Ref.make,
      flatMapEffect(counter =>
        pipe(self, treeAnaE(nodeOrdinalUnfold(counter))),
      ),
      runSync,
    )

withOrdinal.pre =
  (initialize: number) =>
  <A>(self: Tree<A>): Tree<[A, number]> =>
    pipe(
      initialize,
      Ref.make,
      flatMapEffect(counter =>
        treeAnaE(annotateOrdinalUnfold(counter))([self, 0]),
      ),
      runSync,
    )

export const asOrdinalBranch =
  (initialize: number) =>
  (self: Branch<any>): Branch<number> =>
    pipe(self, asOrdinal(initialize)) as Branch<number>

asOrdinalBranch.pre =
  (initialize: number) =>
  <A>(self: Branch<A>) =>
    pipe(self, asOrdinal.pre(initialize)) as Branch<number>

const useCounter = (ref: Ref.Ref<number>): Effect<number> =>
  pipe(
    ref,
    Ref.get,
    tap(() => Ref.update(ref, Number.increment)),
  )
