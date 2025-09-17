import {assertDrawNumericTree, bracketUnfold, lexer} from '#test'
import {branch, of} from '#tree'
import {Function} from '#util'
import {pipe} from 'effect'
import {expect, test} from 'vitest'
import {treeAna, unfold} from './index.js'

test('treeAna', () => {
  // tree = ┬A
  //        ├─B
  //        ├┬C
  //        │├─D
  //        │└─E
  //        └─F
  const encoded = 'A(B, C(D, E), F)'

  const actual = pipe(encoded, lexer, treeAna(bracketUnfold))

  const expected = branch('A', [
    of('B'),
    branch('C', [of('D'), of('E')]),
    of('F'),
  ])

  expect(actual).toEqual(expected)
})

test('unfold', () => {
  const unfolder = (n: number): number[] => (n > 1 ? [n / 2, n / 2] : [])
  const actual = pipe(unfolder, unfold, Function.apply(4))
  assertDrawNumericTree(`
┬4
├┬2
│├─1
│└─1
└┬2
 ├─1
 └─1`)(actual)
})
