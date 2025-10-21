import {map, type Tree} from '#tree'
import {Graph, Option, pipe} from 'effect'
import {Isomorphism} from 'effect-ts-laws/typeclass'
import {EdgeListIsomorphism} from './Isomorphism.js'

/**
 * Convert a tree into an
 * [Effect Graph](https://effect-ts.github.io/effect/effect/Graph.ts.html).
 *
 * A `Tree<A>` is converted into a `DirectedGraph<A, “”>`: a directed graph
 * with nodes of type `A` and an empty string associated with each edge.
 *
 * We do this in two steps. First we replace the tree nodes with their graph
 * node Id giving us a tree of node Ids, then we get the edge list of this tree
 * and add each edge to the graph.
 * @category codec
 * @function
 */
export const treeToGraph = <A>(self: Tree<A>): Graph.Graph<A, ''> =>
  Graph.directed((mutable: Graph.MutableDirectedGraph<A, ''>) => {
    for (const [child, maybeParent] of pipe(
      self,
      map(a => Graph.addNode(mutable, a)),
      Isomorphism.encode(EdgeListIsomorphism<number>()),
    )) {
      pipe(
        maybeParent,
        Option.map(parent => Graph.addEdge(mutable, child, parent, '')),
      )
    }
  })

/**
 * Return a GraphViz representation of a numeric or string tree.
 * @category codec
 * @function
 */
export const treeToGraphViz = (self: Tree<number> | Tree<string>): string => {
  const tree: Tree<string> = map(self as Tree<number>, s =>
    typeof s === 'number' ? s.toString() : s,
  )

  return pipe(tree, treeToGraph, Graph.toGraphViz)
}
