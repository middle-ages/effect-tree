import {describe, expect, test} from 'vitest'
import {Equivalence} from './Equivalence.js'
import {text, row, column} from '../data.js'

describe('equivalence', () => {
  describe('≠', () => {
    const iut = Equivalence

    const topLeft = row('top')('left')
    const left = column('left')

    const rowAb = topLeft([text('a'), text('b')])
    const rowCd = topLeft([text('c'), text('d')])

    const columnAbCd = left([rowAb, rowCd])
    const columnCd = left([rowCd])

    test('row vs. text', () => {
      expect(iut(rowAb, text('foo'))).toBe(false)
    })

    test('row vs. row', () => {
      expect(iut(rowAb, rowCd)).toBe(false)
    })

    test('column of rows vs. column of rows', () => {
      expect(iut(columnAbCd, columnCd)).toBe(false)
    })
  })
})
