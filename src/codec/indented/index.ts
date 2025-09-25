import {annotateDepthUnfold, preOrderFold} from '#ops'
import {fixTree, treeAna, treeHylo, type Tree} from '#tree'
import * as TreeF from '#treeF'
import {Array, Function, pipe, String} from '#util'

/**
 * Encode a string tree into a `YAML`-like indented format where indentation, be
 * default set at `2` spaces, indicates node depth.
 * @param self - The tree to be encoded.
 * @param indent - Optional number of space characters that separate adjacent tree levels. Default is `2`.
 * @category codec
 * @function
 */
export const encode: {
  (self: Tree<string>, indent?: number): Array.NonEmptyArray<string>
  (indent?: number): (self: Tree<string>) => Array.NonEmptyArray<string>
} = Function.dual(
  2,
  (self: Tree<string>, indent = 2): Array.NonEmptyArray<string> => {
    return pipe(
      [self, 0],
      treeHylo(
        annotateDepthUnfold<string>,
        preOrderFold<readonly [string, number]>,
      ),
      Array.map(([a, depth]) =>
        pipe((depth - 1) * indent, String.nSpaces, String.suffix(a)),
      ),
    )
  },
)

/**
 * Decode a list of indented lines into a string tree.
 * @param lines - non-empty array of non-empty strings, each encoding a tree
 * node with indent set as a multiple of node depth.
 * @returns A decoded string tree.
 * @category codec
 * @function
 */
export const decode = (lines: Array.NonEmptyArray<string>): Tree<string> => {
  const [first, second] = lines
  if (second === undefined) return fixTree(TreeF.leafF(first))

  const indentSize = countStartingSpaces(second),
    computeDepth = (line: string) => countStartingSpaces(line) / indentSize,
    mapped: Array.NonEmptyArray<[string, number]> = pipe(
      lines,
      Array.map(line => [line.trimStart(), computeDepth(line)] as const),
    )

  return pipe(mapped, treeAna(decodeIndentedUnfold))
}

/**
 * Decode a single level of a tree from a list of indented lines where indentation
 * represents node depth.
 * @category codec
 * @category unfold
 * @function
 */
export const decodeIndentedUnfold = ([
  [value, depth],
  second,
  ...tail
]: Array.NonEmptyArray<[string, number]>): TreeF.TreeF<
  string,
  Array.NonEmptyArray<[string, number]>
> => {
  if (second === undefined) return TreeF.leafF(value)

  const nodes: Array.NonEmptyArray2<[string, number]> = [[second]]

  for (const [lineValue, lineDepth] of tail)
    if (lineDepth > depth + 1)
      (nodes.at(-1) as Array.NonEmptyArray<[string, number]>).push([
        lineValue,
        lineDepth,
      ])
    else nodes.push([[lineValue, lineDepth]])

  return TreeF.branchF(value, nodes)
}

const countStartingSpaces = (s: string): number =>
  pipe(s, String.takeWhile(String.isEqual(' ')), String.length)
