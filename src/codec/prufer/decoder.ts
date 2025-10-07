import {branch, leaf, type Branch} from '#tree'
import {Array, Pair} from '#util'
import {Number, Option, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {
  decode as decodeEdges,
  rootTreeEdge,
  sortEdgeList,
  type EdgeList,
  type TreeEdge,
} from '../edges.js'

/**
 * Convert the prüfer code of a tree into a list of directed edges
 * in `O(n×log₂n)` compute time where `n` is node count.
 * @category codec
 * @function
 */
export const toEdges = (code: NonEmptyArray<number>): EdgeList<number> => {
  const [degrees, allLeaves] = makeDegreeMap(code)

  let edges: TreeEdge<number>[] = []

  let i = 0,
    leaves = allLeaves,
    child: number | undefined = undefined
  while ((child = leaves.shift()) !== undefined) {
    const parent = code[i++] ?? 1
    const degree = degrees[parent]

    edges = Array.append(edges, [child, Option.some(parent)])

    if (degree === 0 && parent !== 1)
      leaves = Array.insertSorted(leaves)(parent)
    else if (degree !== undefined) degrees[parent] = degree - 1
  }

  return [
    rootTreeEdge(1),
    ...pipe(
      edges as NonEmptyArray<TreeEdge<number>>,
      sortEdgeList(Number.Order),
    ),
  ]
}

/**
 * Convert the prüfer code of a tree into the tree.
 * @category codec
 * @function
 */
export const decode: (code: number[]) => Branch<number> = code =>
  Array.isNonEmptyArray(code)
    ? pipe(code, toEdges, decodeEdges)
    : branch(1, [leaf(2)])

// Compute sorted list of leaves and the degree map
const makeDegreeMap = (
  code: NonEmptyArray<number>,
): [degreeMap: number[], leaves: number[]] => {
  const sorted = pipe(code, Array.sort(Number.Order))
  const leaves = Array.difference(
    Array.range(2, code.length + 2),
    Array.dedupeWith(sorted, Number.Equivalence),
  )

  return [degreeMap(sorted), leaves]
}

// Map the sorted codes to an array mapping aᵢ to the degree of node i
const degreeMap = (sortedCode: NonEmptyArray<number>): number[] => {
  const pairs = pipe(
    sortedCode,
    Array.groupWith(Number.Equivalence),
    Array.map(([head, ...rest]) => [head, rest.length] as Pair.Pair<number>),
  )

  const degrees = pipe(
    sortedCode.length,
    Array.allocate,
    Array.map(() => 0),
  )
  for (const [node, degree] of pairs) degrees[node] = degree

  return degrees
}
