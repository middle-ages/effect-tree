import {from, of} from '#tree'
import {describe, expect, test} from 'vitest'
import {productAll} from './Applicative.js'

describe('productAll', () => {
  test('empty', () => {
    expect(productAll([])).toEqual(of([]))
  })

  test('leaves', () => {
    expect(productAll([of('foo'), of('bar')])).toEqual(of(['foo', 'bar']))
  })

  test('leaf and branch', () => {
    expect(productAll([of('foo'), from('bar', of('baz'))])).toEqual(
      from(['foo', 'bar'], of(['foo', 'baz'])),
    )
  })

  test('pair of congruent branches', () => {
    expect(productAll([from('A1', of('B1')), from('A2', of('B2'))])).toEqual(
      from(['A1', 'A2'], from(['B1', 'A2'], of(['B1', 'B2']))),
    )
  })
})
