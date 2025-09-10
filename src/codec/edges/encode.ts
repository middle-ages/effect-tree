import {treeCata, type Tree, type TreeFolderK} from '#tree'
import * as TreeF from '#treeF'
import {Array, flow, Order, pipe} from 'effect'
import {indexParents} from './map.js'
import {rootTreeEdge, setParent, sortEdgeList} from './ops.js'
import type {EdgeList, EdgeListTypeLambda, EdgeMap} from './types.js'

/** Encode a level of the tree as an edge list. */
export const encodeFold: TreeFolderK<EdgeListTypeLambda> = TreeF.match({
  onLeaf: node => [rootTreeEdge(node)],
  onBranch: (node, forest) =>
    pipe(
      forest,
      Array.flatMap(Array.modifyNonEmptyHead(setParent(node))),
      Array.prepend(rootTreeEdge(node)),
    ),
})

/** Encode the given tree as its edge list. */
export const encode: <A>(tree: Tree<A>) => EdgeList<A> = treeCata(encodeFold)

/** Encode the given tree as its sorted edge list. */
export const encodeSorted: <A>(
  order: Order.Order<A>,
) => (self: Tree<A>) => EdgeList<A> = order => flow(encode, sortEdgeList(order))

/** Encodes and indexes the edge list of the the given tree. */
export const index: <A>(self: Tree<A>) => EdgeMap<A> = flow(
  encode,
  indexParents,
)
