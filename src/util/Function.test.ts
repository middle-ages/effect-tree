import {apply0} from './Function.js'
import {describe, expect, test} from '@effect/vitest'

describe('Function', () => {
  test('apply0', () => {
    expect(apply0(() => 123)).toBe(123)
  })
})
