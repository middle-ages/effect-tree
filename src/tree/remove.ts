import {type EndoK, dual, flow, pipe} from '#Function'
import {length, modForest} from './data.js'
import {getValue, leaf} from './index.js'
import type {Branch, Leaf, Tree, TreeTypeLambda} from './types.js'

/**
 * Strip a branch from its children and return the new leaf.
 * @example
 * import * as Tree from 'effect-tree'
 *
 * const tree = Tree.branch(1, [Tree.of(2)])
 *
 * expect(Tree.removeForest(tree)).toEqual(Tree.of(1))
 * @typeParam A Tree underlying type.
 * @param self The tree from which all nodes will be removed.
 * @returns A leaf tree node.
 * @category basic
 * @function
 */
export const removeForest: <A>(self: Branch<A>) => Leaf<A> = flow(
  getValue,
  leaf,
)

/**
 * Removes `deleteCount` children, starting Nth the direct child of the given
 * tree. If the tree is a branch with a single child then a `Leaf` is returned.
 *
 * If the given index is out-of-bounds, or the given tree is a leaf, it is
 * returned unchanged.
 *
 * If the `deleteCount` is beyond the edge of the list, removes all children
 * from the Nth index.
 * @typeParam A Tree underlying type.
 * @param n Index in root node forest.
 * @param deleteCount Count of nodes to be deleted.
 * @returns The tree with on less node.
 * @category basic
 * @function
 */
export const removeSlice =
  (n: number, deleteCount: number): EndoK<TreeTypeLambda> =>
  /** The tree from which nodes will be removed. */
  self => {
    const index = n + (n < 0 ? length(self) : 0)
    return pipe(
      self,
      modForest(forest =>
        index >= forest.length
          ? [...forest]
          : forest.toSpliced(index, deleteCount),
      ),
    )
  }

/**
 * Removes the Nth direct child of the given tree. If the tree is a branch with
 * a single child then a `Leaf` is returned. If the given index is
 * out-of-bounds, or the given tree is a leaf, it is returned unchanged.
 * @example
 * import * as Tree from 'effect-tree'
 *
 * const tree = Tree.branch(1, [Tree.of(2), Tree.of(3), Tree.of(4)])
 * const changed = Tree.removeNthChild(1, tree)
 *
 * expect(Tree.getForest(changed)).toEqual([Tree.of(2), Tree.of(4)])
 * @typeParam A Tree underlying type.
 * @param n Index in root node forest of node that will be removed.
 * @param self The tree from which a node will be removed.
 * @returns The tree with on less node.
 * @category basic
 * @function
 */
export const removeNthChild: {
  <A>(n: number, self: Tree<A>): Tree<A>
  <A>(self: Tree<A>): (n: number) => Tree<A>
  flip: (n: number) => <A>(self: Tree<A>) => Tree<A>
} = Object.assign(
  dual(2, <A>(n: number, self: Tree<A>) => removeSlice(n, 1)(self)),
  {
    flip: (n: number) => removeSlice(n, 1),
  },
)

/**
 * Remove first child of given tree.
 * @example
 * import * as Tree from 'effect-tree'
 *
 * const tree = Tree.branch(1, [Tree.of(2), Tree.of(3), Tree.of(4)])
 * const changed = Tree.removeFirstChild(tree)
 *
 * expect(Tree.getForest(changed)).toEqual([Tree.of(3), Tree.of(4)])
 * @typeParam A Tree underlying type.
 * @param self The tree from which a node will be removed.
 * @returns The tree with on less node.
 * @category basic
 * @function
 */
export const removeFirstChild = removeNthChild.flip(0)

/**
 * Remove last child of given tree.
 * @example
 * import * as Tree from 'effect-tree'
 *
 * const tree = Tree.branch(1, [Tree.of(2), Tree.of(3), Tree.of(4)])
 * const changed = Tree.removeLastChild(tree)
 *
 * expect(Tree.getForest(changed)).toEqual([Tree.of(2), Tree.of(3)])
 * @typeParam A Tree underlying type.
 * @param self The tree from which a node will be removed.
 * @returns The tree with on less node.
 * @category basic
 * @function
 */
export const removeLastChild = removeNthChild.flip(-1)
