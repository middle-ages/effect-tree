import {drawTree} from '#draw'
import {numericTree} from '#test'
import {type Tree, map} from '#tree'
import {flow, Number, pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {annotateBreadthFirst, replaceBreadthFirst} from './breadthFirst.js'
import {binaryTree} from '../levels.js'
import {asOrdinal} from '../ordinal.js'
import {fromNumber, unwords} from '#String'

describe('annotateDepthFirst', () => {
  const annotateNumericTree: (self: Tree<number>) => Tree<string> = flow(
    annotateBreadthFirst(Number.Order),
    map(([value, ordinal]) =>
      unwords.spaced([ordinal.toString(), value.toString()]),
    ),
  )

  test('basic', () => {
    const actual = annotateNumericTree(numericTree)
    expect(drawTree(actual)).toEqual([
      '┬1 1    ',
      '├┬2 2   ',
      '│├─5 3  ',
      '│├─6 4  ',
      '│└─7 5  ',
      '├┬3 6   ',
      '│├─8 7  ',
      '│├─9 8  ',
      '│└┬10 11',
      '│ └─11 9',
      '└─4 10  ',
    ])
  })

  test('binary tree', () => {
    const tree = pipe(4, binaryTree, asOrdinal(0))
    const actual = annotateNumericTree(tree)
    expect(drawTree(actual)).toEqual([
      '┬1 14    ',
      '├┬2 6    ',
      '│├┬4 2   ',
      '││├─8 0  ',
      '││└─9 1  ',
      '│└┬5 5   ',
      '│ ├─10 3 ',
      '│ └─11 4 ',
      '└┬3 13   ',
      ' ├┬6 9   ',
      ' │├─12 7 ',
      ' │└─13 8 ',
      ' └┬7 12  ',
      '  ├─14 10',
      '  └─15 11',
    ])
  })
})

describe('replaceBreadthFirst', () => {
  const replaceNumericTree: (self: Tree<number>) => Tree<string> = flow(
    replaceBreadthFirst(Number.Order),
    map(fromNumber),
  )

  test('basic', () => {
    const actual = replaceNumericTree(numericTree)
    expect(drawTree(actual)).toEqual([
      '┬1    ',
      '├┬2   ',
      '│├─5  ',
      '│├─6  ',
      '│└─7  ',
      '├┬3   ',
      '│├─8  ',
      '│├─9  ',
      '│└┬10 ',
      '│ └─11',
      '└─4   ',
    ])
  })

  test('binary tree', () => {
    const tree = pipe(4, binaryTree, asOrdinal(0))
    const actual = replaceNumericTree(tree)
    expect(drawTree(actual)).toEqual([
      '┬1    ',
      '├┬2   ',
      '│├┬4  ',
      '││├─8 ',
      '││└─9 ',
      '│└┬5  ',
      '│ ├─10',
      '│ └─11',
      '└┬3   ',
      ' ├┬6  ',
      ' │├─12',
      ' │└─13',
      ' └┬7  ',
      '  ├─14',
      '  └─15',
    ])
  })
})
