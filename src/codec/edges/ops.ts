import {Array, Equivalence, HashMap, HashSet, Option, pipe, Tuple} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import type {EdgeList, EdgeMap, TreeEdge} from './types.js'

/**
 * A tree edge for the root node: parent is `None`.
 * @category internal
 * @function
 */
export const rootTreeEdge = <A>(child: A): [A, Option.Option<A>] => [
  child,
  Option.none(),
]

/**
 * Set a parent on a non-root tree edge.
 * @category internal
 * @function
 */
export const setParent: <A>(a: A) => (edge: TreeEdge<A>) => TreeEdge<A> =
  a =>
  ([head]) => [head, Option.some(a)]

/**
 * Assert the edge map has a single root and return a pair of the root and its
 * possibly empty list of children.
 * @category internal
 * @function
 */
export const getMapChildren = <A>({
  roots,
  toChildren,
}: EdgeMap<A>): [A, A[]] => {
  const [root] = HashSet.values(roots)
  /* v8 ignore next 2 */
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

/**
 * Sets the roots of the edge map to a single root.
 * @category internal
 * @function
 */
export const setMapRoot =
  <A>(map: EdgeMap<A>) =>
  (root: A): EdgeMap<A> => ({...map, roots: HashSet.fromIterable([root])})

/**
 * Given an equivalence of `A`, return an equivalence of `TreeEdge<A>`.
 * @category internal
 * @function
 */
export const getEdgeEquivalence: <A>(
  equalsA: Equivalence.Equivalence<A>,
) => Equivalence.Equivalence<TreeEdge<A>> = equalsA =>
  Tuple.getEquivalence(equalsA, Option.getEquivalence(equalsA))

/**
 * Given an equivalence of `A`, return an equivalence of `EdgeList<A>`.
 * @category internal
 * @function
 */
export const getEdgeListEquivalence: <A>(
  equalsA: Equivalence.Equivalence<A>,
) => Equivalence.Equivalence<EdgeList<A>> = equalsA =>
  pipe(equalsA, getEdgeEquivalence, Array.getEquivalence)

/**
 * Convert a numeric edge list into a list of numeric pairs.
 * Root node edge will appear as `[1, 0]`.
 * @category internal
 * @function
 */
export const numeric: (
  edges: EdgeList<number>,
) => NonEmptyArray<[number, number]> = Array.map(
  Tuple.mapSecond(Option.getOrElse(() => 0)),
)
