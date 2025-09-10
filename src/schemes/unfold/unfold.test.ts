import {bracketUnfold, lexer} from '#test'
import {branch, of} from '#tree'
import {pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {treeAna} from '../unfold.js'

describe('unfold', () => {
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
})
