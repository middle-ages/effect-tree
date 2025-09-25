import {branchF, leafF} from '#treeF'
import {K, Array, flow, Function, Pair, pipe} from '#util'
import {isNone, none, type Option} from 'effect/Option'
import {dual, type EndoOf} from '#Function'
import {
  fixBranch,
  getBranchForest,
  getValue,
  isLeaf,
  match,
  tree,
} from './index.js'
import type {Branch, ForestOf, Tree} from './types.js'

/**
 * Compute child count for root node.
 * @typeParam A - Underlying tree type.
 * @param self - The tree being queried.
 * @returns Numeric child count.
 * @category basic
 * @function
 */
export const length: <A>(self: Tree<A>) => number = match({
  onLeaf: () => 0,
  onBranch: (_, forest) => forest.length,
})

/**
 * Get the forest of any tree node. Result could be an empty list if the given
 * node is a {@link Leaf}.
 *
 * See {@link getBranchForest} for a version that returns the non-empty forest
 * of a branch.
 * @typeParam A - Underlying tree type.
 * @param self - The tree being queried.
 * @returns A possibly empty list of trees.
 * @category basic
 * @function
 */
export const getForest = <A>(self: Tree<A>): readonly Tree<A>[] =>
  pipe(
    self,
    match<A, readonly Tree<A>[]>({
      onLeaf: () => [],
      onBranch: (_, forest) => forest,
    }),
  )

/**
 * Deconstruct the node and possibly empty forest of a tree. Useful in
 * pipelines.
 * @typeParam A - Underlying tree type.
 * @param self - The tree being deconstructed.
 * @returns A pair of the tree node value and a possibly empty list of child trees.
 * @category basic
 * @function
 */
export const destruct = <A>(self: Tree<A>): readonly [A, readonly Tree<A>[]] =>
  pipe(
    self,
    match<A, readonly [A, readonly Tree<A>[]]>({
      onLeaf: Pair.pair.withSecond([]),
      onBranch: Pair.pair,
    }),
  )

/**
 * Same as {@link destruct} but only for _branches_, so you are guaranteed a
 * non-empty forest.
 * @typeParam A - Underlying tree type.
 * @param self - The branch being deconstructed.
 * @returns A pair of the tree node value and a non-empty list of child trees.
 * @category basic
 * @function
 */
export const destructBranch = <A>({
  unfixed: {node, forest},
}: Branch<A>): [A, Array.NonEmptyReadonlyArray<Tree<A>>] => [node, forest]

/**
 * Set the value of a tree root to a given value of the same type.
 * @typeParam A - Underlying tree type.
 * @param self - The tree being changed.
 * @param value - New value for the root node.
 * @returns A new tree where the root value has been replaced by the given value.
 * @category basic
 * @function
 */
export const setValue: {
  <A>(self: Tree<A>, value: A): Tree<A>
  <A>(value: A): (self: Tree<A>) => Tree<A>
} = dual(
  2,
  <A>(self: Tree<A>, value: A): Tree<A> => ({
    unfixed: pipe(
      self,
      match({
        onLeaf: () => leafF(value),
        onBranch: (_, forest) => branchF(value, forest),
      }),
    ),
  }),
)

const _setForest = <A>(self: Tree<A>, forest: ForestOf<A>): Branch<A> =>
  pipe(self, getValue, branchF(forest), fixBranch)

/**
 * Set the root node forest to a given forest of the same type.
 * @typeParam A - Underlying tree type.
 * @param self - The tree being changed.
 * @param forest - New forest.
 * @returns A new tree where the forest has been replaced by the given forest.
 * @category basic
 * @function
 */
export const setForest: {
  <A>(self: Tree<A>, forest: ForestOf<A>): Branch<A>
  <A>(forest: ForestOf<A>): (self: Tree<A>) => Branch<A>
  flip: <A>(self: Tree<A>) => (forest: ForestOf<A>) => Branch<A>
} = Object.assign(dual(2, _setForest), {
  flip:
    <A>(self: Tree<A>) =>
    (forest: ForestOf<A>) =>
      _setForest(self, forest),
})

/**
 * Run the given function over the given tree if it is a branch, else return the
 * tree unchanged. This is like {@link match} where the `onLeaf` branch is set
 * to `identity`.
 * @typeParam A - Underlying tree type.
 * @param self - Tree on which to run the given function.
 * @param f - A function from {@link Branch} to {@link Tree}.
 * @returns The tree unchanged if it is a leaf, else the result of applying the
 * given function on the branch.
 * @category basic
 * @function
 */
export const modBranch: {
  <A>(self: Tree<A>, f: (branch: Branch<A>) => Tree<A>): Tree<A>
  <A>(f: (branch: Branch<A>) => Tree<A>): (self: Tree<A>) => Tree<A>
} = dual(
  2,
  <A>(self: Tree<A>, f: (branch: Branch<A>) => Tree<A>): Tree<A> =>
    isLeaf(self) ? self : f(self),
)

/**
 * Run a function to change the value, but not the type, of the top level
 * node of the given tree.
 * @typeParam A - Underlying tree type.
 * @param self - Tree on which to run the given function.
 * @param f - Function to apply on the root node value.
 * @returns The given tree with its root node value set to the result of the given function.
 * @category basic
 * @function
 */
export const modValue: {
  <A>(self: Tree<A>, f: (a: A) => A): Tree<A>
  <A>(f: (a: A) => A): (self: Tree<A>) => Tree<A>
} = dual(
  2,
  <A>(self: Tree<A>, f: (a: A) => A): Tree<A> =>
    setValue(self, pipe(self, getValue, f)),
)

/**
 * Run a function to change the root node forest. If the tree is a {@link Leaf}
 * the given function will receive the empty array as a parameter, if it returns
 * any trees then leaves will be turned into a {@link Branch}es, and if it
 * returns the empty array branches will be turned into leaves.
 * @typeParam A - Underlying tree type.
 * @param self - Tree on which to run the given function.
 * @param f - Function to apply on the root forest.
 * @returns The given tree with its root forest set to the result of the given function.
 * @category basic
 * @function
 */
export const modForest: {
  <A>(self: Tree<A>, f: EndoOf<readonly Tree<A>[]>): Tree<A>
  <A>(f: EndoOf<readonly Tree<A>[]>): (self: Tree<A>) => Tree<A>
} = dual(
  2,
  <A>(self: Tree<A>, f: EndoOf<readonly Tree<A>[]>): Tree<A> =>
    pipe(self, Pair.fanout(getValue, flow(getForest, f)), tree.tupled),
)

/**
 * Same as {@link modForest} but only accepts branches, so the given function is
 * guaranteed to get a non empty forest as its argument.
 * @typeParam A - Underlying tree type.
 * @param f - Function to apply on the root forest.
 * @returns The given branch with its root forest set to the result of the given function.
 * @category basic
 * @function
 */
export const modBranchForest =
  <A>(f: (a: ForestOf<A>) => ForestOf<A>): ((self: Branch<A>) => Branch<A>) =>
  /** Branch on which to run the given function. */
  self =>
    setForest(self, pipe(self, getBranchForest, f))

/**
 * Return the first child tree of a branch.
 * @typeParam A - Underlying tree type.
 * @param self - tree to navigate.
 * @returns The tree that is first in the forest of the given branch.
 * @category basic
 * @function
 */
export const firstChild = <A>(self: Branch<A>): Tree<A> =>
  pipe(self, getBranchForest, Array.headNonEmpty)

/**
 * Return the last child tree of a branch.
 * @typeParam A - Underlying tree type.
 * @param self - tree to navigate.
 * @returns The tree that is last in the forest of the given branch.
 * @category basic
 * @function
 */
export const lastChild = <A>(self: Branch<A>): Tree<A> =>
  pipe(self, getBranchForest, Array.lastNonEmpty)

const _nthChild = <A>(n: number, self: Tree<A>): Option<Tree<A>> =>
  pipe(
    self,
    match({
      onLeaf: K(none<Tree<A>>()),
      onBranch: (_, forest) =>
        Array.get(forest, n + (n < 0 ? forest.length : 0)),
    }),
  )

/**
 * Return the Nth child tree of a tree or `Option.none()` if index is
 * out-of-bounds or if given tree is a leaf.
 *
 * Negative indexes are handled as offsets from the end of the forest with `-1`
 * being the last child, `-2` the child before it, and so on.
 * @typeParam A - Underlying tree type.
 * @param n - index of requested node in parent forest. Negative indexes are
 * accepted.
 * @param self - Node will be taken from this tree's forest.
 * @returns An optional tree.
 * @category basic
 * @function
 */
export const nthChild: {
  <A>(n: number, self: Tree<A>): Option<Tree<A>>
  <A>(self: Tree<A>): (n: number) => Option<Tree<A>>
  flip: (n: number) => <A>(self: Tree<A>) => Option<Tree<A>>
} = Object.assign(
  dual(2, <A>(n: number, self: Tree<A>) => _nthChild(n, self)),
  {
    flip:
      (n: number) =>
      <A>(self: Tree<A>) =>
        _nthChild(n, self),
  },
)

const _drill = <A>(path: number[], self: Tree<A>): Option<Tree<A>> => {
  const [head, ...tail] = path
  if (head === undefined) return none()

  let child = nthChild(head, self)
  if (isNone(child)) return none()

  for (const index of tail) {
    child = nthChild(index, child.value)
    if (isNone(child)) return none()
  }

  return child
}

/**
 * Drill down to get the child node at a given index path or none. Negative
 * indexes are handled as in {@link nthChild}: as offsets from the end
 * of the forest with `-1` being the last child, `-2` the child before it, and
 * so on.
 *
 * An empty path will return the given tree.
 * @typeParam A - Underlying tree type.
 * @param path - a possibly empty array of numeric indexes that form a path from
 * root node to some child node.
 * accepted.
 * @param self - node will be taken from the forest of this node.
 * @returns An optional tree.
 * @category basic
 * @function
 */
export const drill: {
  <A>(path: number[], self: Tree<A>): Option<Tree<A>>
  <A>(self: Tree<A>): (path: number[]) => Option<Tree<A>>
  flip: (path: number[]) => <A>(self: Tree<A>) => Option<Tree<A>>
} = Object.assign(Function.dual(2, _drill), {
  flip:
    (path: number[]) =>
    <A>(self: Tree<A>) =>
      drill(path, self),
})

const _sliceForest = <A>(self: Tree<A>, low: number, high?: number) =>
  pipe(
    self,
    match({
      onLeaf: _ => [] as Tree<typeof _>[],
      onBranch: (_, forest) => forest.slice(low, high),
    }),
  )

/**
 * Get a slice from the forest of the given tree. An empty path will return the
 * given tree.
 * @typeParam A - Underlying tree type.
 * @param self - The tree to query.
 * accepted.
 * @param low - Index of slice start.
 * @param high - Optional length of slice. Default is a single tree node.
 * @returns Possibly empty list of trees.
 * @category basic
 * @function
 */
export const sliceForest: {
  <A>(self: Tree<A>, low: number, high?: number): Tree<A>[]
  flip: <A>(self: Tree<A>) => (low: number, high?: number) => Tree<A>[]
  curry: (low: number, high?: number) => <A>(self: Tree<A>) => Tree<A>[]
} = Object.assign(_sliceForest, {
  curry:
    (low: number, high?: number) =>
    <A>(self: Tree<A>) =>
      _sliceForest(self, low, high),
  flip:
    <A>(self: Tree<A>) =>
    (low: number, high?: number) =>
      _sliceForest(self, low, high),
})
