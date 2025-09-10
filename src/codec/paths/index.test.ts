import {getNumberedArbitrary} from '#arbitrary/Tree'
import {Paths, Prufer} from '#codec'
import {assertDrawTree, numericTree} from '#test'
import {of} from '#tree'
import {type NonEmptyArray2} from '#util/Array'
import {Number, pipe, String} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import fc from 'fast-check'
import {describe, expect, test} from 'vitest'
import {isValidPathList} from './guard.js'

const paths: NonEmptyArray2<number> = [
  [1, 2, 3],
  [1, 2, 4],
  [1, 2, 5],
  [1, 6, 7],
  [1, 6, 8],
  [1, 6, 11, 9],
  [1, 10],
]

describe('paths', () => {
  describe('fold', () => {
    test('leaf', () => {
      const tree = of('A')
      expect(Paths.encode(tree)).toEqual([['A']])
    })

    test('numeric tree', () => {
      expect(Paths.encode(numericTree)).toEqual(paths)
    })
  })

  describe('unfold', () => {
    test('numeric tree', () => {
      expect(Paths.decode(Number.Order)(paths)).toEqual(numericTree)
    })

    test('string tree', () => {
      const paths: NonEmptyArray<NonEmptyArray<string>> = [
        ['A', 'A.A'],
        ['A', 'A.B'],
        ['A', 'A.C', 'A.C.D'],
        ['A', 'A.C', 'A.C.E'],
      ]

      pipe(
        paths,
        Paths.decode(String.Order),
        assertDrawTree(`
┬A
├─A.A
├─A.B
└┬A.C
 ├─A.C.D
 └─A.C.E`),
      )
    })
  })

  describe('isValidPathList', () => {
    const iut = Paths.isValidPathList(Number.Equivalence)

    describe('true', () => {
      test('All trees of nodeCount≔5 have valid paths', () => {
        for (const tree of Prufer.allTreesAt(5)) {
          const paths = Paths.encode(tree)
          expect(iut(paths)).toBeTruthy()
        }
      })
    })

    describe('false', () => {
      test('different roots', () => {
        expect(
          iut([
            [1, 2],
            [2, 3],
          ]),
        ).toBeFalsy()
      })

      test('leaf appears twice', () => {
        expect(
          iut([
            [1, 2, 3],
            [1, 2, 4],
            [1, 2, 3],
          ]),
        ).toBeFalsy()
      })

      test('node has different parents', () => {
        expect(
          iut([
            [1, 2, 3, 4],
            [1, 2, 5],
            [1, 2, 4, 3],
          ]),
        ).toBeFalsy()
      })

      test('identical paths', () => {
        expect(iut([[1], [1]])).toBeFalsy()
      })
    })
  })

  test('All encoded trees are valid paths', () => {
    const arbitrary = getNumberedArbitrary({
      branchBias: 1 / 3,
      maxChildren: 4,
      maxDepth: 3,
    })

    fc.assert(
      fc.property(arbitrary, tree => {
        expect(
          pipe(tree, Paths.encode, isValidPathList(Number.Equivalence)),
        ).toBe(true)
      }),
      {numRuns: 50},
    )
  })
})
