import {monoRecord, pluck, pluckOf, withKey} from './Record.js'
import {pipe} from 'effect'
import {describe, expect, test} from '@effect/vitest'

describe('Record', () => {
  test('monoRecord', () => {
    expect(monoRecord(42)('foo', 'bar', 'baz')).toEqual({
      foo: 42,
      bar: 42,
      baz: 42,
    })
  })

  test('withKey', () => {
    expect(withKey('foo')(42)).toEqual({foo: 42})
  })

  test('pluck', () => {
    expect(pipe({foo: 123, bar: 456}, pluck('bar'))).toEqual(456)
  })

  test('pluckOf', () => {
    type FooBar = Record<'foo' | 'bar', number>
    const fooBar: FooBar = {foo: 123, bar: 456}
    expect(pipe(fooBar, pluckOf<FooBar>()('bar'))).toEqual(456)
  })
})
