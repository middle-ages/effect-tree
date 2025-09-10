import {branch, leaf} from '#tree'
import {productAll} from './Applicative.js'
import {describe, expect, test} from 'vitest'

describe('Applicative', () => {
  describe('productAll', () => {
    test('empty', () => {
      expect(productAll([])).toEqual(leaf([]))
    })

    test('leaves', () => {
      expect(productAll([leaf('foo'), leaf('bar')])).toEqual(
        leaf(['foo', 'bar']),
      )
    })

    test('leaf and branch', () => {
      expect(productAll([leaf('foo'), branch('bar', [leaf('baz')])])).toEqual(
        branch(['foo', 'bar'], [leaf(['foo', 'baz'])]),
      )
    })
  })
})
