import {Array, pipe} from '#util'
import {branch, leaf, type Branch} from '#tree'
import {Option} from 'effect'
import {decode as decodeEdges, type EdgeList} from '../edges.js'

/**
 * Convert a prüfer code into a tree.
 * @category codec
 * @function
 */
export const decode: (code: number[]) => Branch<number> = code =>
  Array.isNonEmptyArray(code)
    ? pipe(code, toEdges, decodeEdges)
    : branch(1, [leaf(2)])

/**
 * Convert a prüfer code into a list of directed edges in linear time.
 * @category codec
 * @function
 */
export const toEdges = (
  code: Array.NonEmptyReadonlyArray<number>,
): EdgeList<number> => {
  const edges = [] as unknown as EdgeList<number>
  const degree: number[] = [-1, 2, ...pipe(1, Array.replicate(code.length + 1))]

  for (const node of code) {
    ;(degree[node] as number)++
  }

  let leaf = degree.indexOf(1)

  for (const parent of code) {
    edges.push([leaf, Option.some(parent)])
    ;(degree[leaf] as number)--

    leaf =
      --(degree[parent] as number) === 1 && parent < leaf
        ? parent
        : degree.indexOf(1, leaf)
  }

  return [[1, Option.none()], [leaf, Option.some(1)], ...edges]
}
