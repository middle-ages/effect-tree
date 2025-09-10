import {Prufer} from '#codec'
import {numericTree} from '#test'
import {branch, of, type Branch, type Tree} from '#tree'
import {Array, Pair, Record, String} from '#util'
import {Number, Option, pipe, Tuple} from 'effect'
import {describe, expect, test} from 'vitest'
import type {EdgeList} from '../edges.js'

const encode = Prufer.encode(Number.Order),
  decode = Prufer.decode

describe('prüfer encode/decode', () => {
  describe('to/from prüfer', () => {
    /*

   •──┬─1
      ├─┬─2         
      │ ├───3       
      │ └───4     
      ├───5
      └─┬─6         
        ├───7       
        ├───8     
        └─┬─9     
          └───10

    */
    const tree: Branch<number> = branch(1, [
      branch(2, [of(3), of(4)]),
      of(5),
      branch(6, [of(7), of(8), branch(9, [of(10)])]),
    ])

    const code: Array.NonEmptyArray<number> = [2, 2, 1, 1, 6, 6, 9, 6]

    const edgeList: EdgeList<number> = pipe(
      [
        [1, 0],
        [2, 1],
        [3, 2],
        [4, 2],
        [5, 1],
        [6, 1],
        [7, 6],
        [8, 6],
        [9, 6],
        [10, 9],
      ] as Array.NonEmptyArray<Pair.Pair<number>>,
      Array.map(Tuple.mapSecond(Option.liftPredicate(n => n !== 0))),
    )

    test('encodePrüfer', () => {
      expect(encode(tree)).toEqual(code)
    })

    test('prüferToEdges', () => {
      expect(Prufer.toEdges(code)).toEqual(edgeList)
    })
  })

  test('Round trip: decode ∘ encode = id', () => {
    const actualTree: Tree<number> = pipe(
      numericTree as Branch<number>,
      encode,
      Prufer.decode,
    )

    expect(actualTree).toEqual(numericTree)
  })

  describe('encode', () => {
    test('[]', () => {
      expect(encode(branch(1, [of(2)]))).toEqual([])
    })
    test('[1]', () => {
      expect(encode(branch(1, [of(2), of(3)]))).toEqual([1])
    })
    test('[2]', () => {
      expect(encode(branch(1, [branch(2, [of(3)])]))).toEqual([2])
    })
    test('[3]', () => {
      expect(encode(branch(1, [branch(3, [of(2)])]))).toEqual([3])
    })
    test('[1, 1]', () => {
      expect(encode(branch(1, [of(2), of(3), of(4)]))).toEqual([1, 1])
    })
  })

  describe('decode', () => {
    test('1(2)', () => {
      expect(decode([])).toEqual(branch(1, [of(2)]))
    })

    test('1(2, 3)', () => {
      expect(decode([1])).toEqual(branch(1, [of(2), of(3)]))
    })

    test('1(2(3))', () => {
      expect(decode([2])).toEqual(branch(1, [branch(2, [of(3)])]))
    })

    test('1(3(2))', () => {
      expect(decode([3])).toEqual(branch(1, [branch(3, [of(2)])]))
    })
  })

  describe('All 30 (16 + 14w) permutations for the 16 trees (4⁴⁻²) of 4 labeled nodes', () => {
    const tests: Record<
      string,
      readonly [
        number[],
        Branch<number>,
        ...[altKey: string, altTree: Branch<number>][],
      ]
    > = {
      '1(2, 3, 4)': [
        [1, 1],
        branch(1, [of(2), of(3), of(4)]),
        ['1(2, 4, 3)', branch(1, [of(2), of(4), of(3)])],
        ['1(3, 2, 4)', branch(1, [of(3), of(2), of(4)])],
        ['1(3, 4, 2)', branch(1, [of(3), of(4), of(2)])],
        ['1(4, 2, 3)', branch(1, [of(4), of(2), of(3)])],
        ['1(4, 3, 2)', branch(1, [of(4), of(3), of(2)])],
      ],

      '1(2(4), 3)': [
        [1, 2],
        branch(1, [branch(2, [of(4)]), of(3)]),
        ['1(3, 2(4))', branch(1, [of(3), branch(2, [of(4)])])],
      ],

      '1(2, 3(4))': [
        [1, 3],
        branch(1, [of(2), branch(3, [of(4)])]),
        ['1(3(4), 2)', branch(1, [branch(3, [of(4)]), of(2)])],
      ],

      '1(2, 4(3))': [
        [1, 4],
        branch(1, [of(2), branch(4, [of(3)])]),
        ['1(4(3), 2)', branch(1, [branch(4, [of(3)]), of(2)])],
      ],

      '1(2(3), 4)': [
        [2, 1],
        branch(1, [branch(2, [of(3)]), of(4)]),
        ['1(4, 2(3))', branch(1, [of(4), branch(2, [of(3)])])],
      ],

      '1(2(3, 4))': [
        [2, 2],
        branch(1, [branch(2, [of(3), of(4)])]),
        ['1(2(4, 3))', branch(1, [branch(2, [of(4), of(3)])])],
      ],

      '1(3(2(4)))': [[2, 3], branch(1, [branch(3, [branch(2, [of(4)])])])],

      '1(4(2(3)))': [[2, 4], branch(1, [branch(4, [branch(2, [of(3)])])])],

      '1(3(2), 4)': [
        [3, 1],
        branch(1, [branch(3, [of(2)]), of(4)]),
        ['1(4, 3(2))', branch(1, [of(4), branch(3, [of(2)])])],
      ],

      '1(2(3(4)))': [[3, 2], branch(1, [branch(2, [branch(3, [of(4)])])])],

      '1(3(2, 4))': [
        [3, 3],
        branch(1, [branch(3, [of(2), of(4)])]),
        ['1(3(4, 2))', branch(1, [branch(3, [of(4), of(2)])])],
      ],

      '1(4(3(2)))': [[3, 4], branch(1, [branch(4, [branch(3, [of(2)])])])],

      '1(3, 4(2))': [
        [4, 1],
        branch(1, [of(3), branch(4, [of(2)])]),
        ['1(4(2), 3)', branch(1, [branch(4, [of(2)]), of(3)])],
      ],

      '1(2(4(3)))': [[4, 2], branch(1, [branch(2, [branch(4, [of(3)])])])],

      '1(3(4(2)))': [[4, 3], branch(1, [branch(3, [branch(4, [of(2)])])])],

      '1(4(2, 3))': [
        [4, 4],
        branch(1, [branch(4, [of(2), of(3)])]),
        ['1(4(3, 2))', branch(1, [branch(4, [of(3), of(2)])])],
      ],
    }

    const formatCode = (code: number[]) =>
      pipe(
        code,
        Array.map(String.fromNumber),
        String.unwords.comma,
        String.surround.squareBrackets,
      )

    let i = 0,
      j = 0
    for (const [key, [code, tree, ...congruent]] of Record.toEntries(tests)) {
      i++
      describe(`${i.toString().padStart(2)}.   ${key}`, () => {
        test(`${(++j).toString().padStart(2)}. encode     ${key} → ${formatCode(code)}`, () => {
          expect(encode(tree)).toEqual(code)
        })

        for (const [key, tree] of congruent) {
          test(`${(++j).toString().padStart(2)}. encode alt ${key} → ${formatCode(code)}`, () => {
            expect(encode(tree)).toEqual(code)
          })
        }

        test(`    decode     ${key} ← ${formatCode(code)}`, () => {
          expect(decode(code)).toEqual(tree)
        })
      })
    }
  })
})
