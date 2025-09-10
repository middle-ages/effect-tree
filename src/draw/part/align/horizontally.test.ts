import {alignHorizontally} from './horizontally.js'
import {describe, expect, test} from 'vitest'
import {widestLine} from '#util/String'
import {
  forHorizontalAlignments,
  showAlignment,
  type HorizontalAlignment,
} from './data.js'

describe('alignHorizontally', () => {
  const testAlignWith =
    (padding: string) =>
    (rows: string[], top: string[], middle: string[], bottom: string[]) => {
      const expected = [top, middle, bottom] as const

      const name = [
        `${widestLine(rows).toString()}ᵂ`,
        '×',
        `${rows.length.toString()}ᴴ`,
      ].join(' ')

      describe(name, () => {
        forHorizontalAlignments((align: HorizontalAlignment, i) => {
          test(showAlignment(align), () => {
            expect(alignHorizontally(padding, align)(rows)).toEqual(expected[i])
          })
        })
      })
    }

  describe('basic', () => {
    describe('strutWidth≔1', () => {
      const testAlign = testAlignWith('•')
      testAlign([], [], [], [])

      describe('lineCount≔1', () => {
        testAlign([''], [''], [''], [''])
        testAlign(['a'], ['a'], ['a'], ['a'])
        testAlign(['abc'], ['abc'], ['abc'], ['abc'])
      })

      describe('lineCount≔2', () => {
        testAlign(['a', ''], ['a', '•'], ['a', '•'], ['a', '•'])
        testAlign(['ab', ''], ['ab', '••'], ['ab', '••'], ['ab', '••'])
        testAlign(['ab', 'A'], ['ab', 'A•'], ['ab', 'A•'], ['ab', '•A'])
      })

      describe('lineCount≔3', () => {
        testAlign(
          ['a', '', ''],
          ['a', '•', '•'],
          ['a', '•', '•'],
          ['a', '•', '•'],
        )
        testAlign(
          ['abc', '', 'A'],
          ['abc', '•••', 'A••'],
          ['abc', '•••', '•A•'],
          ['abc', '•••', '••A'],
        )
      })
    })

    describe('strutWidth≔3', () => {
      const testAlign = testAlignWith('₁₂₃')

      describe('lineCount≔1', () => {
        testAlign([''], [''], [''], [''])
        testAlign(['abc'], ['abc'], ['abc'], ['abc'])
      })

      describe('lineCount≔2', () => {
        testAlign(['a', ''], ['a', '₁'], ['a', '₁'], ['a', '₁'])
      })

      describe('lineCount≔4', () => {
        testAlign(
          ['abc', 'AB', 'W-X-Y-Z', 'w'],
          ['abc₁₂₃₁', 'AB₁₂₃₁₂', 'W-X-Y-Z', 'w₁₂₃₁₂₃'],
          ['₁₂abc₁₂', '₁₂AB₁₂₃', 'W-X-Y-Z', '₁₂₃w₁₂₃'],
          ['₁₂₃₁abc', '₁₂₃₁₂AB', 'W-X-Y-Z', '₁₂₃₁₂₃w'],
        )
      })
    })
  })
})
