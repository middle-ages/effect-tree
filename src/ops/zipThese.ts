import {
  getNode,
  leaf,
  mapEffect,
  match,
  treeC,
  treeCata,
  withForest,
  type Tree,
} from '#tree'
import * as TreeF from '#treeF'
import {Array, flow, Function, pipe} from '#util'
import {
  bimap as bimapThese,
  Both,
  Left,
  match as matchThese,
  pad as padThese,
  Right,
  unzipArray,
  zipArraysWith,
  type These,
} from '#util/These'
import {Effect, identity, type Option} from 'effect'
import {succeedBy} from 'effect-ts-folds'

export const zipTheseWithE = <A, B, C>(f: (these: These<A, B>) => C) => {
  const [fromLeft, fromRight]: [
    (tree: Tree<A>) => Effect.Effect<Tree<C>>,
    (tree: Tree<B>) => Effect.Effect<Tree<C>>,
  ] = [
    mapEffect(succeedBy(flow(Right.from, f))),
    mapEffect(succeedBy(flow(Left.from, f))),
  ]

  return (self: Tree<A>, that: Tree<B>): Effect.Effect<Tree<C>> => {
    const zip: (self: Tree<A>, that: Tree<B>) => Effect.Effect<Tree<C>> =
      zipTheseWithE(f)

    const node: C = f(Both.from(getNode(self), getNode(that)))

    const withNode: <E, R>(
      self: Effect.Effect<Tree<C>[], E, R>,
    ) => Effect.Effect<Tree<C>, E, R> = Effect.map(withForest(node))

    const buildTree =
      <T>(f: (tree: Tree<T>) => Effect.Effect<Tree<C>>) =>
      (forest: Array.NonEmptyReadonlyArray<Tree<T>>): Effect.Effect<Tree<C>> =>
        pipe(forest, Effect.forEach(f), withNode)

    return pipe(
      self,
      match({
        onLeaf: () =>
          pipe(
            that,
            match({
              onLeaf: () => pipe(node, leaf, Effect.succeed),
              onBranch: (_, thatForest) => buildTree(fromRight)(thatForest),
            }),
          ),
        onBranch: (_, selfForest) =>
          pipe(
            that,
            match({
              onLeaf: () => buildTree(fromLeft)(selfForest),
              onBranch: (_, thatForest) =>
                pipe(
                  zipArraysWith(
                    thatForest,
                    selfForest,
                    matchThese({
                      Left: ({left}) => fromLeft(left),
                      Right: ({right}) => fromRight(right),
                      Both: ({left, right}) => zip(left, right),
                    }),
                  ),
                  Effect.all,
                  withNode,
                ),
            }),
          ),
      }),
    )
  }
}

/**
 * Unzip a single level in a tree of `These<A, B>` into a pair of potentially
 * non-congruent optional trees of type `A` and `B`.
 */
export const unzipTheseFold: <A, B>(
  self: TreeF.TreeF<These<A, B>, These<Tree<A>, Tree<B>>>,
) => These<Tree<A>, Tree<B>> = TreeF.match({
  onLeaf: node => pipe(node, bimapThese(leaf, leaf)),
  onBranch: (node, forest) => {
    const [leftForest, rightForest] = unzipArray(forest)
    return pipe(node, bimapThese(treeC(rightForest), treeC(leftForest)))
  },
})

export const unzipThese = <A, B>(
  self: Tree<These<A, B>>,
): [Option.Option<Tree<A>>, Option.Option<Tree<B>>] =>
  pipe(self, treeCata(unzipTheseFold<A, B>), padThese)

export const zipTheseWith = <A, B, C>(
  f: (these: These<A, B>) => C,
): ((self: Tree<A>, that: Tree<B>) => Tree<C>) =>
  flow(zipTheseWithE(f), Effect.runSync)

export const zipThese: {
  <A, B>(self: Tree<A>, that: Tree<B>): Tree<These<A, B>>
  <B>(that: Tree<B>): <A>(self: Tree<A>) => Tree<These<A, B>>
} = Function.dual(2, <A, B>(self: Tree<A>, that: Tree<B>) =>
  zipTheseWith(identity<These<A, B>>)(self, that),
)
