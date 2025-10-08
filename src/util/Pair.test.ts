import {expect, test} from '@effect/vitest'
import {Number} from 'effect'
import {applyPair, fanout, pair, pairMap, square} from './Pair.js'

test('fanout', () => {
  const actual = fanout((n: number) => n.toString(), Number.increment)(1)
  expect(actual).toEqual(['1', 2])
})

test('pairMap', () => {
  const actual = pairMap(Number.increment)([1, 43])
  expect(actual).toEqual([2, 44])
})

test('withFirst', () => {
  const actual = pair.withFirst(42)('foo')
  expect(actual).toEqual([42, 'foo'])
})

test('withSecond', () => {
  const actual = pair.withSecond(42)('foo')
  expect(actual).toEqual(['foo', 42])
})

test('square', () => {
  expect(square(42)).toEqual([42, 42])
})

test('mapFirst', () => {
  expect(square.mapFirst(Number.increment)(1)).toEqual([2, 1])
})

test('mapSecond', () => {
  expect(square.mapSecond(Number.increment)(1)).toEqual([1, 2])
})

test('applyPair', () => {
  expect(applyPair([1, Number.increment])).toBe(2)
})
