import {describe, expect, test} from '@effect/vitest'
import {pipe} from 'effect'
import {pluck, withKey} from './Record.js'

describe('Record', () => {
  test('withKey', () => {
    expect(withKey('foo')(42)).toEqual({foo: 42})
  })

  test('pluck', () => {
    expect(pipe({foo: 123, bar: 456}, pluck('bar'))).toEqual(456)
  })
})
