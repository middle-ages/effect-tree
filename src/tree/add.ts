import {Array} from '#util'
import {dual, pipe} from '#util/Function'
import {branch, getValue, isLeaf, match} from './index.js'
import {length, modBranchForest, modForest, setForest} from './data.js'
import type {Branch, ForestOf, Tree} from './types.js'

/**
 * Insert a list of trees before Nth child of the given tree. The list is
 * inserted so that the head element of the inserted list becomes the Nth child
 * of the tree, and the previous Nth child is pushed after the inserted list.
 *
 * Negative indexes are handled as offsets from the final tree in the forest so
 * that inserting a list to index `-1` inserts the list _before_ the last
 * tree of the forest. Use {@link appendAll} to append _after_ the last tree
 * in the forest.
 *
 * If `self` is a _leaf_, it is converted into a branch.
 *
 * If the index is out-of-bounds, I.E.: negative or greater than `forest length
 * - 1`, the list is appended to the _end_ of the forest.
 * @typeParam A - Tree underlying type.
 * @param self - The tree to modify.
 * @param children - Non-empty list of child trees to insert.
 * @returns A new updated tree with the new child trees inserted.
 * @category basic
 * @function
 */
export const insertAllAt: {
  <A>(self: Tree<A>, n: number, children: ForestOf<A>): Branch<A>
  <A>(n: number, children: ForestOf<A>): (self: Tree<A>) => Branch<A>
} = dual(3, <A>(self: Tree<A>, n: number, children: ForestOf<A>): Branch<A> => {
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
 * @param child- Child to insert.
 * @returns A new updated tree with the new node inserted.
 * @category basic
 * @function
 */
export const insertAt: {
  <A>(self: Tree<A>, child: Tree<A>, n: number): Branch<A>
  <A>(child: Tree<A>): (self: Tree<A>, n: number) => Branch<A>
} = dual(
  3,
  <A>(self: Tree<A>, child: Tree<A>, n: number): Branch<A> =>
    insertAllAt(self, n, [child]),
)

/**
 * Append a tree to the children of the root node. If `self` is a _leaf_, it is
 * converted into a branch.
 * @typeParam A - Tree underlying type.
 * @param self - The tree to modify.
 * @param child - Child to append.
 * @returns A new updated tree with the new node appended.
 * @category basic
 * @function
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
 * Prepend a tree to the children of the root node. If `self` is a _leaf_, it is
 * converted into a branch.
 * @typeParam A - Tree underlying type.
 * @param self - The tree to modify.
 * @param child - Child to prepend.
 * @returns A new updated tree with the new node prepended.
 * @category basic
 * @function
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
 * Append a list of trees to the children of the root node. If `self` is a
 * _leaf_, it is converted into a branch.
 * @typeParam A - Tree underlying type.
 * @param self - The tree to modify.
 * @param children - A non-empty list of trees to append to the tree.
 * @returns A new updated tree with the new nodes appended.
 * @category basic
 * @function
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
 * Prepend a list of trees to the children of the root node. If `self` is a
 * _leaf_, it is converted into a branch.
 * @typeParam A - Tree underlying type.
 * @param self - The tree to modify.
 * @param children - A non-empty list of trees to prepend to the tree.
 * @returns A new updated tree with the new nodes prepended.
 * @category basic
 * @function
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
