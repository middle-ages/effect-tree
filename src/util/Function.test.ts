import {expect, test} from '@effect/vitest'
import {apply0} from './Function.js'

test('apply0', () => {
  expect(apply0(() => 123)).toBe(123)
})
