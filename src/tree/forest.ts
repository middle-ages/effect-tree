import {Array} from '#util'
import {dual, flow, pipe} from '#util/Function'
import {
  branch,
  getValue,
  isLeaf,
  leaf,
  length,
  match,
  modBranchForest,
  modForest,
  setForest,
} from './index.js'
import type {Branch, ForestOf, Leaf, Tree} from './types.js'

/**
 * Insert a list of trees before Nth child of the given tree. The list is
 * inserted so that the head element of the inserted list becomes the Nth child
 * of the tree, and the previous Nth child is pushed after the inserted list.
 *
 * Negative indexes are handled as offsets from the final tree in the forest so
 * that inserting a list to index `-1` inserts the list _before_ the last
 * tree of the forest. Use {@link AppendAll} to append _after_ the last tree.
 *
 * If `self` is a _leaf_, it is converted into a branch.
 *
 * If the index is out-of-bounds, I.E.: negative or greater than `forest length
 * - 1`, the list is appended to the _end_ of the forest.
 *
 * @typeParam A - Tree underlying type.
 * @param self - The tree to modify.
 * @param children - Non-empty list of child trees to insert.
 * @returns A new updated tree, or the given tree if unchanged.
 * @category basic
 */
export const insertAllAt: {
  <A>(self: Tree<A>, children: ForestOf<A>, n: number): Branch<A>
  <A>(children: ForestOf<A>): (self: Tree<A>, n: number) => Branch<A>
} = dual(3, <A>(self: Tree<A>, children: ForestOf<A>, n: number): Branch<A> => {
  const index = n + (n < 0 ? length(self) : 0)
  return pipe(
    self,
    match({
      onLeaf: branch(children),
      onBranch: (value, oldForest) => {
        const forest =
          index >= oldForest.length
            ? [...oldForest, ...children]
            : oldForest.toSpliced(index, 0, ...children)

        return branch(value, forest as unknown as ForestOf<A>)
      },
    }),
  )
})

/**
 * Insert a tree before Nth child of the given tree. The tree is inserted so
 * that it becomes the Nth child of the tree, and the previous Nth child becomes
 * moves over to position N+1.
 *
 * Negative indexes are handled as offsets from the final tree in the forest so
 * that inserting a tree to index `-1` inserts the tree _before_ the last
 * tree of the forest. Use {@link append} to append _after_ the last tree.
 *
 * If `self` is a _leaf_, it is converted into a branch.
 *
 * If the index is out-of-bounds, I.E.: negative or greater than `forest length
 * - 1`, the tree is appended to the _end_ of the forest.
 * @typeParam A - Tree underlying type.
 * @param self - The tree to modify.
 * @param child - Child to insert.
 * @returns A new updated tree, or the given tree if unchanged.
 * @category basic
 */
export const insertAt: {
  <A>(self: Tree<A>, child: Tree<A>, n: number): Branch<A>
  <A>(child: Tree<A>): (self: Tree<A>, n: number) => Branch<A>
} = dual(
  3,
  <A>(self: Tree<A>, child: Tree<A>, n: number): Branch<A> =>
    insertAllAt(self, [child], n),
)

/**
 * Append a tree to the children of the root node. If `self` is a _leaf_, it is
 * converted into a branch.
 * @category basic
 */
export const append: {
  <A>(self: Tree<A>, child: Tree<A>): Branch<A>
  <A>(child: Tree<A>): (self: Tree<A>) => Branch<A>
} = dual(
  2,
  <A>(self: Tree<A>, child: Tree<A>): Branch<A> =>
    isLeaf(self)
      ? pipe(self, getValue, branch([child]))
      : pipe(self, modBranchForest(Array.append(child))),
)

/**
 * Prepend a tree to the children of the root node.
 * @category basic
 */
export const prepend: {
  <A>(self: Tree<A>, child: Tree<A>): Branch<A>
  <A>(child: Tree<A>): (self: Tree<A>) => Branch<A>
} = dual(
  2,
  <A>(self: Tree<A>, child: Tree<A>): Branch<A> =>
    isLeaf(self)
      ? pipe(self, getValue, branch([child]))
      : pipe(self, modBranchForest(Array.prepend(child))),
)

/**
 * Append a list of trees to the children of the root node.
 * @category basic
 */
export const appendAll: {
  <A>(self: Tree<A>, children: Tree<A>[]): Tree<A>
  <A>(children: Tree<A>[]): (self: Tree<A>) => Tree<A>
} = dual(
  2,
  <A>(self: Tree<A>, children: Tree<A>[]): Tree<A> =>
    Array.isNonEmptyArray(children)
      ? isLeaf(self)
        ? pipe(self, setForest(children))
        : pipe(self, modForest(Array.appendAll(children)))
      : self,
)

/**
 * Prepend a list of trees to the children of the root node.
 * @category basic
 */
export const prependAll: {
  <A>(self: Tree<A>, children: Tree<A>[]): Tree<A>
  <A>(children: Tree<A>[]): (self: Tree<A>) => Tree<A>
} = dual(
  2,
  <A>(self: Tree<A>, children: Tree<A>[]): Tree<A> =>
    Array.isNonEmptyArray(children)
      ? isLeaf(self)
        ? pipe(self, setForest(children))
        : pipe(self, modForest(Array.prependAll(children)))
      : self,
)

/**
 * Strip a branch from its children and return the new leaf.
 * @category basic
 */
export const removeForest: <A>(node: Branch<A>) => Leaf<A> = flow(
  getValue,
  leaf,
)

const _removeNthChild = <A>(rawN: number, self: Tree<A>): Tree<A> =>
  pipe(
    self,
    modForest(forest =>
      Array.remove(forest, rawN < 0 ? forest.length + rawN : rawN),
    ),
  )

/**
 * Removes the nth direct child of the given tree. If the tree is a branch with
 * a single child then a `Leaf` is returned. If the given index is
 * out-of-bounds, or the given tree is a leaf, it is returned unchanged.
 * @category basic
 */
export const removeNthChild: {
  <A>(n: number, self: Tree<A>): Tree<A>
  <A>(self: Tree<A>): (n: number) => Tree<A>
  flip: (n: number) => <A>(self: Tree<A>) => Tree<A>
} = Object.assign(
  dual(2, <A>(n: number, self: Tree<A>) => _removeNthChild(n, self)),
  {
    flip:
      (n: number) =>
      <A>(self: Tree<A>) =>
        _removeNthChild(n, self),
  },
)

/**
 * Remove first child of given tree.
 * @category basic
 */
export const removeFirstChild = removeNthChild.flip(0)

/**
 * Remove last child of given tree.
 * @category basic
 */
export const removeLastChild = removeNthChild.flip(-1)

const _sliceForest = <A>(self: Tree<A>, low: number, high?: number) =>
  pipe(
    self,
    match({
      onLeaf: _ => [] as Tree<typeof _>[],
      onBranch: (_, forest) => forest.slice(low, high),
    }),
  )

/**
 * Get a slice from the forest of the given tree.
 * @category basic
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
