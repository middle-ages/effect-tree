import {
  Array,
  Boolean,
  Equivalence,
  flow,
  HashMap,
  HashSet,
  Option,
  Order,
  pipe,
  Predicate,
  Tuple,
} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {isEdgeIndexed} from './map.js'
import type {EdgeList, EdgeMap, TreeEdge} from './types.js'

/** A tree edge for the root node: parent is `None`. */
export const rootTreeEdge = <A>(child: A): [A, Option.Option<A>] => [
  child,
  Option.none(),
]

/** Set a parent on a non-root tree edge. */
export const setParent: <A>(a: A) => (edge: TreeEdge<A>) => TreeEdge<A> =
  a =>
  ([head]) => [head, Option.some(a)]

/**
 * Assert the edge map has a single root and return a pair of the root and its
 * possibly empty list of children.
 */
export const getMapChildren = <A>({
  roots,
  toChildren,
}: EdgeMap<A>): [A, A[]] => {
  const [root] = HashSet.values(roots)
  if (root === undefined) throw new Error('Edge map |roots|=0')
  if (HashSet.size(roots) !== 1) throw new Error('Edge map |roots|≠1')

  return [
    root,
    pipe(
      toChildren,
      HashMap.get(root),
      Option.getOrElse(() => []),
    ),
  ]
}

/** Sets the roots of the edge map to a single root. */
export const setMapRoot =
  <A>(map: EdgeMap<A>) =>
  (root: A): EdgeMap<A> => ({...map, roots: HashSet.fromIterable([root])})

/** Given an order of `A`, return an order of `TreeEdge<A>`. */
export const getEdgeOrder = <A>(o: Order.Order<A>): Order.Order<TreeEdge<A>> =>
  Order.mapInput(o, ([child]) => child)

/** Given an equivalence of `A`, return an equivalence of `TreeEdge<A>`. */
export const getEdgeEquivalence: <A>(
  equalsA: Equivalence.Equivalence<A>,
) => Equivalence.Equivalence<TreeEdge<A>> = equalsA =>
  Tuple.getEquivalence(equalsA, Option.getEquivalence(equalsA))

/** Given an equivalence of `A`, return an equivalence of `EdgeList<A>`. */
export const getEdgeListEquivalence: <A>(
  equalsA: Equivalence.Equivalence<A>,
) => Equivalence.Equivalence<EdgeList<A>> = equalsA =>
  pipe(equalsA, getEdgeEquivalence, Array.getEquivalence)

/** Sort the edge list by the given order. */
export const sortEdgeList =
  <A>(o: Order.Order<A>) =>
  (edges: EdgeList<A>): typeof edges =>
    pipe(edges, Array.sort(Tuple.getOrder(o, Option.getOrder(o))))

/**
 * Convert a numeric edge list into a list of numeric pairs.
 * Root node edge will appear as `[1, 0]`.
 */
export const numeric: (
  edges: EdgeList<number>,
) => NonEmptyArray<[number, number]> = Array.map(
  Tuple.mapSecond(Option.getOrElse(() => 0)),
)

/** True if all given edges are indexed in the given edge map. */
export const areEdgesIndexed = <A>(
  index: EdgeMap<A>,
): Predicate.Predicate<EdgeList<A>> =>
  flow(
    Array.map(edge => isEdgeIndexed([edge, index])),
    Boolean.every,
  )
