import {Arbitrary} from '#arbitrary/Part'
import {testConcreteTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe, expect, test} from 'vitest'
import {PartEquivalence} from './Equivalence.js'
import {row} from './row.js'
import {text} from './data.js'
import {column} from './column.js'

describe('equivalence', () => {
  describe('≠', () => {
    const iut = PartEquivalence

    const topLeft = row.top.left
    const left = column.left

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

describe('Part typeclass laws', () => {
  testConcreteTypeclassLaws(
    {Equivalence: PartEquivalence},
    {a: Arbitrary(), equalsA: PartEquivalence},
    {numRuns: 30},
  )
})
