/**
 * Add/remove nodes and forests.
 * @packageDocumentation
 */
import {Array} from '#util'
import {dual, flow, pipe} from '#util/Function'
import {
  branch,
  getValue,
  isLeaf,
  leaf,
  match,
  modBranchForest,
  modForest,
  setForest,
} from './index.js'
import type {Branch, Leaf, Tree} from './types.js'

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
