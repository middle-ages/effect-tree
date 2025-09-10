import {describe, expect, test} from 'vitest'
import {
  average,
  computeRunningAverage,
  max,
  min,
  MonoidAverage,
  multiply,
  sum,
  updateRunningAverage,
} from './numeric.js'
import {numericTree} from '#test'
import {from, of} from '#tree'

describe('numeric ops', () => {
  test('sum', () => {
    expect(sum(numericTree)).toBe((12 * 11) / 2)
  })

  test('multiply', () => {
    expect(multiply(numericTree)).toBe(
      11 * 10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1,
    )
  })

  test('max', () => {
    expect(max(numericTree)).toBe(11)
  })

  test('min', () => {
    expect(min(numericTree)).toBe(1)
  })

  describe('running average', () => {
    const averaged = MonoidAverage.combineAll([
      {numerator: 10, denominator: 1},
      {numerator: 0, denominator: 1},
      {numerator: 7, denominator: 1},
      {numerator: 3, denominator: 1},
    ])

    test('computing running average with no samples returns zero', () => {
      expect(computeRunningAverage({numerator: 0, denominator: 0})).toBe(0)
    })

    test('computeRunningAverage', () => {
      expect(computeRunningAverage(averaged)).toBe(5)
    })

    test('updateRunningAverage', () => {
      const average = updateRunningAverage(100)(averaged)
      expect(computeRunningAverage(average)).toBe((5 * 4 + 100) / 5)
    })

    test('average', () => {
      expect(average(from(10, of(0), from(7, of(3))))).toBe(5)
    })
  })
})
