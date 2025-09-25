import {getTheme, themedTree, type Theme} from '#draw'
import {pipe, Array, String} from '#util'
import {type Tree, map} from '#tree'
import {unlines} from '#String'
import {expect} from 'vitest'

export const drawTree = (tree: Tree<string>, theme?: Theme) =>
  '\n' +
  pipe(
    tree,
    themedTree(theme ?? getTheme('thin')),
    Array.map(String.trimEnd),
    unlines,
  )

export const assertDrawTree = (expected: string) => (tree: Tree<string>) => {
  expect(drawTree(tree)).toBe(expected)
}

export const assertDrawNumericTree =
  (expected: string) => (tree: Tree<number>) => {
    expect(drawTree(map(tree, String.fromNumber))).toBe(expected)
  }
