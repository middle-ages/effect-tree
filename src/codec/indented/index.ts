import {annotateDepthUnfold, preOrderFold} from '#ops'
import {fixTree, treeAna, treeHylo, type Tree} from '#tree'
import * as TreeF from '#treeF'
import {Array, identity, pipe, String} from '#util'

/**
 * Given an encoder that can format a value of type `A` into a single line
 * string, encode a tree of `A` into a `YAML`-like indented format where
 * indentation indicates node depth.
 * @category codec
 */
export const encode =
  (indent: number) =>
  <A>(formatter: (a: A, depth: number) => string) =>
  (self: Tree<A>): Array.NonEmptyArray<string> => {
    type Pair = readonly [A, number]
    return pipe(
      [self, 0],
      treeHylo(annotateDepthUnfold<A>, preOrderFold<Pair>),
      Array.map(
        ([a, depth]) =>
          String.nSpaces((depth - 1) * indent) + formatter(a, depth - 1),
      ),
    )
  }

encode.string = (self: Tree<string>): Array.NonEmptyArray<string> =>
  encode(2)<string>(identity)(self)

/**
 * Decode a list of indented lines into a string tree.
 * @category codec
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
 * Decode a level of a tree from a list of indented lines where indentation
 * represents node depth.
 * @category codec
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
