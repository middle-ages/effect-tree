import {Array, Number} from 'effect'
import {describe, expect, test} from 'vitest'
import {insertSorted} from './Array.js'

describe('array', () => {
  describe('insertSorted', () => {
    const sorted = [2, 4, 6, 12, 100]
    const insert = insertSorted(sorted)
    const ns = [1, 3, 12, 20, 200]

    for (const n of ns) {
      test(`insert(${n.toString()})`, () => {
        expect(insert(n)).toEqual(Array.sortBy(Number.Order)([...sorted, n]))
      })
    }
  })
})
