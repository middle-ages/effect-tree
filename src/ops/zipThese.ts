/**
 * Associative zipping of trees without cropping.
 * @packageDocumentation
 */
import {
  getValue,
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

/**
 * Just like {@link zipThese} except the result is in an effect.
 * @category ops
 */
export const zipTheseWithEffect = <A, B, C>(f: (these: These<A, B>) => C) => {
  const [fromLeft, fromRight]: [
    (tree: Tree<A>) => Effect.Effect<Tree<C>>,
    (tree: Tree<B>) => Effect.Effect<Tree<C>>,
  ] = [
    mapEffect(succeedBy(flow(Right.from, f))),
    mapEffect(succeedBy(flow(Left.from, f))),
  ]

  const withValue: (
    value: C,
  ) => <E, R>(
    self: Effect.Effect<Tree<C>[], E, R>,
  ) => Effect.Effect<Tree<C>, E, R> = value => Effect.map(withForest(value))

  const buildTree =
    (value: C) =>
    <T>(f: (tree: Tree<T>) => Effect.Effect<Tree<C>>) =>
    (forest: Array.NonEmptyReadonlyArray<Tree<T>>): Effect.Effect<Tree<C>> =>
      pipe(forest, Effect.forEach(f), withValue(value))

  return (self: Tree<A>, that: Tree<B>): Effect.Effect<Tree<C>> => {
    const value: C = f(Both.from(getValue(self), getValue(that)))

    return pipe(
      self,
      match({
        onLeaf: () =>
          pipe(
            that,
            match({
              onLeaf: () => pipe(value, leaf, Effect.succeed),
              onBranch: (_, thatForest) =>
                buildTree(value)(fromRight)(thatForest),
            }),
          ),
        onBranch: (_, selfForest) =>
          pipe(
            that,
            match({
              onLeaf: () => buildTree(value)(fromLeft)(selfForest),
              onBranch: (_, thatForest) =>
                pipe(
                  zipArraysWith(
                    thatForest,
                    selfForest,
                    matchThese({
                      Left: ({left}) => fromLeft(left),
                      Right: ({right}) => fromRight(right),
                      Both: ({left, right}) =>
                        zipTheseWithEffect(f)(left, right),
                    }),
                  ),
                  Effect.all,
                  withValue(value),
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
 * @category fold
 */
export const unzipTheseFold: <A, B>(
  self: TreeF.TreeF<These<A, B>, These<Tree<A>, Tree<B>>>,
) => These<Tree<A>, Tree<B>> = TreeF.match({
  onLeaf: bimapThese(leaf, leaf),
  onBranch: (value, forest) => {
    const [leftForest, rightForest] = unzipArray(forest)
    return pipe(value, bimapThese(treeC(rightForest), treeC(leftForest)))
  },
})

/**
 * Unzip a tree of {@link These} into a pair of optional trees.
 *
 * See also {@link zipThese} for the opposite operation.
 * @category ops
 */
export const unzipThese = <A, B>(
  self: Tree<These<A, B>>,
): [Option.Option<Tree<A>>, Option.Option<Tree<B>>] =>
  pipe(self, treeCata(unzipTheseFold<A, B>), padThese)

/**
 * Just like {@link zipThese} except the given function will be given the
 * {@link These} value for the pair. If both are present, the function will
 * receive a {@link Both}. Otherwise it will receive either a
 * {@link Left} or a {@link Right}.
 * @category ops
 */
export const zipTheseWith = <A, B, C>(
  f: (these: These<A, B>) => C,
): ((self: Tree<A>, that: Tree<B>) => Tree<C>) =>
  flow(zipTheseWithEffect(f), Effect.runSync)

/**
 * Like {@link zip}, except does not crop to the shortest/shallowest branch of
 * the zipped pair. Instead it _stretches_ the tree to the longest/deepest
 * branch of the zipper pair, and is thus associative.
 *
 * To account for subtrees where only one of the sides is available, the
 * tree is returned not as a `Tree<[A, B]>`, but instead as a
 * `Tree<These<A, B>>`. See {@link These | the These API} for more information.
 *
 * See also:
 *
 * 1. {@link unzipThese} for the opposite operation.
 * 2. {@link zipTheseWith} to run a function on the partial pair.
 * @category ops
 */
export const zipThese: {
  <A, B>(self: Tree<A>, that: Tree<B>): Tree<These<A, B>>
  <B>(that: Tree<B>): <A>(self: Tree<A>) => Tree<These<A, B>>
} = Function.dual(2, <A, B>(self: Tree<A>, that: Tree<B>) =>
  zipTheseWith(identity<These<A, B>>)(self, that),
)
