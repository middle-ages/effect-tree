import {
  leaf,
  tree,
  treePara,
  type ForestTypeLambda,
  type Tree,
  type TreeProductFolderK,
} from '#tree'
import * as TreeF from '#treeF'
import {Array, flow, pipe, Tuple} from 'effect'
import type {NonEmptyArray} from 'effect/Array'

/**
 * The set of all bottom-grounded subtrees of a tree. This is the set
 * of every subtree of the tree `T` that:
 *
 * 1. The subtree root is a node of `T`. Every node in `T` appears exactly
 *    once in its subtrees list as root node.
 * 2. The leaves of the subtree are exactly the leaves reachable from its
 *    root node in the tree `T`. This makes it _bottom-grounded_.
 *
 * The number of such subtrees of a tree is the number of nodes in the tree.
 *
 * For example consider the tree:
 *
 * ```txt
 * ┬root
 * ├┬a
 * │├─b
 * │└─c
 * └┬d
 *  ├─e
 *  └─f
 * ```
 * `bottomSubtrees` will return for this tree _seven_ trees, one per node:
 *
 * ```txt
 *   1. ─b       4. ─e     7. ┬root
 *                            ├┬a
 *   2. ─c       5. ─f        │├─b
 *                            │└─c
 *   3. ┬a       6. ┬d        └┬d
 *      ├─b         ├─e        ├─e
 *      └─c         └─f        └─f
 * ```
 * @category ops
 */
export const bottomSubtrees = <A>(self: Tree<A>): NonEmptyArray<Tree<A>> =>
  pipe(self, treePara(bottomSubtreesFold))

/**
 * Collect all bottom-grounded subtrees of a single tree level.
 * @category fold
 */
export const bottomSubtreesFold: TreeProductFolderK<ForestTypeLambda> =
  TreeF.match({
    onLeaf: flow(leaf, Array.of),
    onBranch: (value, forest) => [
      ...pipe(forest, Array.map(Tuple.getSecond), Array.flatten),
      tree(value, pipe(forest, Array.map(Tuple.getFirst))),
    ],
  })
