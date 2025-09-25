import {widestLine} from '#String'
import {describe, expect, test} from 'vitest'
import {
  type HorizontalAlignment,
  forHorizontalAlignments,
  showAlignment,
} from './data.js'
import {alignHorizontally} from './horizontally.js'
import {HStrut, HStruts} from '../struts.js'

const testAlignWith =
  (left: HStrut, right = left, useLeftRound = false) =>
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
          expect(
            alignHorizontally(HStruts(left, right), align, useLeftRound)(rows),
          ).toEqual(expected[i])
        })
      })
    })
  }

describe('strutWidth≔1', () => {
  const testAlign = testAlignWith(HStrut(['•']))
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
    testAlign(['a', '', ''], ['a', '•', '•'], ['a', '•', '•'], ['a', '•', '•'])
    testAlign(
      ['abc', '', 'A'],
      ['abc', '•••', 'A••'],
      ['abc', '•••', '•A•'],
      ['abc', '•••', '••A'],
    )
  })
})

describe('strutWidth≔3, different struts for left and right', () => {
  const testAlign = testAlignWith(
    HStrut(['₁', '₂', '₃']),
    HStrut(['¹', '²', '³']),
  )

  describe('lineCount≔1', () => {
    testAlign([''], [''], [''], [''])
    testAlign(['abc'], ['abc'], ['abc'], ['abc'])
  })

  describe('lineCount≔2', () => {
    testAlign(['a', ''], ['a', '¹'], ['a', '¹'], ['a', '₁'])
  })

  describe('lineCount≔4', () => {
    testAlign(
      ['abc', 'AB', 'W-X-Y-Z', 'w'],
      ['abc¹²³¹', 'AB¹²³¹²', 'W-X-Y-Z', 'w¹²³¹²³'],
      ['₁₂abc¹²', '₁₂AB¹²³', 'W-X-Y-Z', '₁₂₃w¹²³'],
      ['₁₂₃₁abc', '₁₂₃₁₂AB', 'W-X-Y-Z', '₁₂₃₁₂₃w'],
    )
  })
})

describe('useLeftRound=false', () => {
  testAlignWith(HStrut(['«']), HStrut(['»']), false)(
    ['abc', 'AB', 'W-X-Y-Z', 'w'],
    ['abc»»»»', 'AB»»»»»', 'W-X-Y-Z', 'w»»»»»»'],
    ['««abc»»', '««AB»»»', 'W-X-Y-Z', '«««w»»»'],
    ['««««abc', '«««««AB', 'W-X-Y-Z', '««««««w'],
  )
})

describe('useLeftRound=true', () => {
  testAlignWith(HStrut(['«']), HStrut(['»']), true)(
    ['abc', 'AB', 'W-X-Y-Z', 'w'],
    ['abc»»»»', 'AB»»»»»', 'W-X-Y-Z', 'w»»»»»»'],
    ['««abc»»', '«««AB»»', 'W-X-Y-Z', '«««w»»»'],
    ['««««abc', '«««««AB', 'W-X-Y-Z', '««««««w'],
  )
})
