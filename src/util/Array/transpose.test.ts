import {pipe} from 'effect'
import {map, type NonEmptyArray} from 'effect/Array'
import {none, some} from 'effect/Option'
//import {Law, lawTests, tinyArray} from 'effect-ts-laws'
//import {verboseLawSets} from 'effect-ts-laws/vitest'
import {unwords} from '../String.js'
import {transpose} from '../Array.js'
import {type Tuple3} from '../Tuple.js'
import {type NonEmptyArray2, transposeRectangle} from './transpose.js'
import {describe, expect, test} from '@effect/vitest'
import type {Tuple} from '#util'

const toSome = (...rows: NonEmptyArray2<string>) => pipe(rows, map(map(some)))

const testTransposeNonEmpty =
  (message: string, ...rows: NonEmptyArray2<string>) =>
  (...expected: typeof rows) => {
    test(message, () => {
      expect(transpose.nonEmpty(rows)).toEqual(toSome(...expected))
    })
  }

const testTransposeRectangle =
  (message: string, ...rows: NonEmptyArray2<string>) =>
  (...expected: typeof rows) => {
    testTransposeNonEmpty(message, ...rows)(...expected)

    test(unwords.spaced.rest(message, 'transposeRectangle'), () => {
      expect(transposeRectangle.nonEmpty(rows)).toEqual(expected)
    })
  }

describe('transpose', () => {
  test('no rows', () => {
    expect(transpose([])).toEqual([])
  })

  describe('nonEmpty', () => {
    testTransposeNonEmpty('single cell', ['foo'])(['foo'])
    testTransposeNonEmpty('single row', ['foo', 'bar'])(['foo'], ['bar'])
    testTransposeNonEmpty('single column', ['foo'], ['bar'])(['foo', 'bar'])

    describe('rectangular', () => {
      const [abc, xyz, oneTwoThree]: Tuple3<NonEmptyArray<string>> = [
        ['a', 'b', 'c'],
        ['x', 'y', 'z'],
        ['1', '2', '3'],
      ] as const

      testTransposeRectangle('rows=1', abc)(['a'], ['b'], ['c'])
      testTransposeRectangle('rows=2', abc, xyz)(
        ['a', 'x'],
        ['b', 'y'],
        ['c', 'z'],
      )
      testTransposeRectangle(
        'rows=3',
        abc,
        xyz,
        oneTwoThree,
      )(['a', 'x', '1'], ['b', 'y', '2'], ['c', 'z', '3'])
    })

    describe('irregular shape', () => {
      const [rowABC, rowX, row12]: Tuple.Tuple3<NonEmptyArray<string>> = [
        ['a', 'b', 'c'],
        ['x'],
        ['1', '2'],
      ]

      test('rows=2', () => {
        expect(transpose.nonEmpty([rowABC, [...rowX]])).toEqual([
          [some('a'), some('x')],
          [some('b'), none()],
          [some('c'), none()],
        ])
      })

      test('rows=3', () => {
        expect(transpose.nonEmpty([rowABC, rowX, row12])).toEqual([
          [some('a'), some('x'), some('1')],
          [some('b'), none(), some('2')],
          [some('c'), none(), none()],
        ])
      })
    })
  })
})

//    const digit = fc.integer({min: 0, max: 9}).map(number)

//    verboseLawSets([
//      lawTests(
//        'transpose laws',
//        Law(
//          'cell position change ≡ flipY + turnClockWise(½π)',
//          '0≤i<rows, 0≤j<columns => aᵢⱼ → aⱼᵢ',
//          pipe(digit, tinyArray, tinyArray),
//        )(rows => {
//          const actual = transpose(rows)
//          let rowIndex = 0
//          for (const row of rows) {
//            let columnIndex = 0
//            for (const cell of row) {
//              const actualColumn = actual[columnIndex]

//              const transposed = getOrElse(() => {})(
//                actualColumn?.[rowIndex] ?? none(),
//              )

//              if (transposed === undefined || transposed !== cell) {
//                throw new Error(
//                  'Found mismatch at' +
//                    `row #${rowIndex.toString()} column #${columnIndex.toString()}`,
//                )
//              }
//              columnIndex++
//            }
//            rowIndex++
//          }

//          return true
//        }),
//      ),
//    ])
//  }
//  })
//})
