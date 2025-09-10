import {getTheme, themedTree, type Theme} from '#draw'
import {type Tree, map} from '#tree'
import {Array, pipe, String} from 'effect'
import {unlines} from '#util/String'
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
    expect(drawTree(map(tree, s => s.toString()))).toBe(expected)
  }
