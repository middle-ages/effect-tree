import {describe, expect, test} from '@effect/vitest'
import {fromRadix, toRadix} from './Number.js'

describe('Number', () => {
  describe('toRadix', () => {
    test('123 at base 10', () => {
      expect(toRadix(123, 10)).toEqual([1, 2, 3])
    })

    test('8 binary', () => {
      expect(toRadix(8, 2)).toEqual([1, 0, 0, 0])
    })
  })

  describe('fromRadix', () => {
    test('123 at base 10', () => {
      expect(fromRadix([1, 2, 3], 10)).toEqual(123)
    })

    test('8 binary', () => {
      expect(fromRadix([1, 0, 0, 0], 2)).toEqual(8)
    })
  })
})
