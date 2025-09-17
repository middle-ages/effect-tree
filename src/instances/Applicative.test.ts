import {from, of} from '#tree'
import {productAll} from './Applicative.js'
import {describe, expect, test} from 'vitest'

describe('productAll', () => {
  test('empty', () => {
    expect(productAll([])).toEqual(of([]))
  })

  test('leaves', () => {
    expect(productAll([of('foo'), of('bar')])).toEqual(of(['foo', 'bar']))
  })

  test('of and branch', () => {
    expect(productAll([of('foo'), from('bar', of('baz'))])).toEqual(
      from(['foo', 'bar'], of(['foo', 'baz'])),
    )
  })
})
