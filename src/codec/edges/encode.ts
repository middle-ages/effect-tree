import {treeCata, type Tree, type TreeFolderK} from '#tree'
import * as TreeF from '#treeF'
import {Array, flow, pipe} from 'effect'
import {indexParents} from './map.js'
import {rootTreeEdge, setParent} from './ops.js'
import type {EdgeList, EdgeListTypeLambda, EdgeMap} from './types.js'

/**
 * Encode a level of the tree as an edge list.
 * @category codec
 * @category fold
 * @function
 */
export const encodeFold: TreeFolderK<EdgeListTypeLambda> = TreeF.match({
  onLeaf: node => [rootTreeEdge(node)],
  onBranch: (node, forest) =>
    pipe(
      forest,
      Array.flatMap(Array.modifyNonEmptyHead(setParent(node))),
      Array.prepend(rootTreeEdge(node)),
    ),
})

/**
 * Encode the given tree as its edge list.
 *
 * ```ts
 * import {Codec, from, of} from 'effect-tree'
 *
 * // •──┬─1
 * //    ├─┬─2
 * //    │ ├───3    Will be encoded as the list of pairs. Each pair encodes
 * //    │ ├───4    a single edge from child to parent. All parents will
 * //    │ └───5    be wrapped in an Option.some(). A single element will
 * //    ├─┬─6      appear in the list where the parent (target of the edge)
 * //    │ ├───7    will be Option.none(). The head element of this pair
 * //    │ ├───8    is the tree root node.
 * //    │ └─┬─11
 * //    │   └───9
 * //    └───10
 * const tree: Tree<number> = from(1,
 *   from(2, of(3), of(4), of(5)),
 *   from(6, of(7), of(8), from(11, of(9))),
 *   of(10),
 * )
 *
 * const edges = Codec.Edges.encode(tree)
 * // edges = [
 * //   [ 1,  none()  ],
 * //   [ 2,  some(1) ],
 * //   [ 3,  some(2) ],
 * //   [ 4,  some(2) ],
 * //   [ 5,  some(2) ],
 * //   [ 6,  some(1) ],
 * //   [ 7,  some(6) ],
 * //   [ 8,  some(6) ],
 * //   [ 11, some(6) ],
 * //   [ 9,  some(11)],
 * //   [ 10, some(1) ],
 * // ]
 * ```ts
 */
export const encode: <A>(tree: Tree<A>) => EdgeList<A> = treeCata(encodeFold)

/** Encodes and indexes the edge list of the the given tree. */
export const index: <A>(self: Tree<A>) => EdgeMap<A> = flow(
  encode,
  indexParents,
)
