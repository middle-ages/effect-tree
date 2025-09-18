import {longestChildLength, shortestChildLength} from '#util/Array'
import {type EndoOf} from '#util/Function'
import {suffix, widestLine} from '#util/String'
import {Array, flow, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {describe, expect, test} from 'vitest'
import {forVerticalAlignments, showAlignment} from './data.js'
import {alignHorizontally} from './horizontally.js'
import {alignVertically} from './vertically.js'
import {HStrut, VStrut, type AreaStruts} from '../struts.js'
import {type HorizontalAlignment, type VerticalAlignment} from './data.js'

type Columns = NonEmptyArray<string[]>

const testAlignWith =
  ({vStrut, hStrut}: AreaStruts) =>
  (hAlign: HorizontalAlignment) =>
  (columns: Columns, top: Columns, middle: Columns, bottom: Columns) => {
    const expected = [top, middle, bottom] as const
    const [min, max] = [
      `${shortestChildLength(columns).toString()}ᴴₘᵢₙ`,
      `${longestChildLength(columns).toString()}ᴴₘₐₓ`,
    ]

    const widths = pipe(
      columns,
      Array.map(flow(widestLine, s => s.toString(), suffix('ᵂₘₐₓ'))),
      Array.join(', '),
    )

    const alignOrthogonal: EndoOf<string[]> = alignHorizontally(hStrut, hAlign)

    const name = `{${widths}}×{${max}:${min}}`

    describe(name, () => {
      forVerticalAlignments((vAlign: VerticalAlignment, i) => {
        test(showAlignment(vAlign) + '.' + showAlignment(hAlign), () => {
          expect(
            alignVertically(vStrut, vAlign, alignOrthogonal)(columns),
          ).toEqual(expected[i])
        })
      })
    })
  }

describe('paddingWidth≔1', () => {
  const testAlign = testAlignWith({
    hStrut: HStrut(['•']),
    vStrut: VStrut(['∘']),
  })
  describe('align left', () => {
    const testAlignLeft = testAlign('left')

    testAlign('center')([[]], [[]], [[]], [[]])

    describe('columnCount≔1', () => {
      describe('rowCount≔1', () => {
        testAlignLeft([['a']], [['a']], [['a']], [['a']])
      })

      describe('rowCount≔2', () => {
        testAlignLeft(
          [['a', 'bc']],
          [['a•', 'bc']],
          [['a•', 'bc']],
          [['a•', 'bc']],
        )
      })
    })

    describe('columnCount≔2', () => {
      describe('rowCount≔1', () => {
        testAlignLeft(
          [['a'], ['b']],
          [['a'], ['b']],
          [['a'], ['b']],
          [['a'], ['b']],
        )
      })

      describe('rowCount≔2, same height', () => {
        testAlignLeft(
          [
            ['a', 'bc'],
            ['ABCD', 'A'],
          ],
          [
            ['a•', 'bc'],
            ['ABCD', 'A•••'],
          ],
          [
            ['a•', 'bc'],
            ['ABCD', 'A•••'],
          ],
          [
            ['a•', 'bc'],
            ['ABCD', 'A•••'],
          ],
        )
      })

      describe('rowCount≔2, different heights', () => {
        testAlignLeft(
          [
            ['a', 'bc'],
            ['ABCD', 'ABC', 'AB', 'D'],
          ],
          [
            ['a•', 'bc', '∘•', '∘•'],
            ['ABCD', 'ABC•', 'AB••', 'D•••'],
          ],
          [
            ['∘•', 'a•', 'bc', '∘•'],
            ['ABCD', 'ABC•', 'AB••', 'D•••'],
          ],
          [
            ['∘•', '∘•', 'a•', 'bc'],
            ['ABCD', 'ABC•', 'AB••', 'D•••'],
          ],
        )
      })
    })
  })

  describe('align right', () => {
    const testAlignRight = testAlign('right')

    describe('rowCount≔2, different heights', () => {
      testAlignRight(
        [
          ['a', 'bc'],
          ['ABCD', 'ABC', 'AB', 'D'],
        ],
        [
          ['•a', 'bc', '•∘', '•∘'],
          ['ABCD', '•ABC', '••AB', '•••D'],
        ],
        [
          ['•∘', '•a', 'bc', '•∘'],
          ['ABCD', '•ABC', '••AB', '•••D'],
        ],
        [
          ['•∘', '•∘', '•a', 'bc'],
          ['ABCD', '•ABC', '••AB', '•••D'],
        ],
      )
    })
  })
})
