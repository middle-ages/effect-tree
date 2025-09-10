import {describe, expect, test} from 'vitest'
import {max, min, multiply, sum} from './numeric.js'
import {numericTree} from '#test'

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
})
