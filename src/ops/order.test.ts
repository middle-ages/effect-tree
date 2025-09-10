import {describe, expect, test} from 'vitest'
import {
  maximumLeaf,
  maximumLeafAndParent,
  maximumNode,
  minimumLeaf,
  minimumLeafAndParent,
  minimumNode,
} from './order.js'
import {Number, Option} from 'effect'
import {numericTree} from '#test'

describe('order', () => {
  test('minimumNode', () => {
    expect(minimumNode(Number.Order)(numericTree)).toBe(1)
  })

  test('maximumNode', () => {
    expect(maximumNode(Number.Order)(numericTree)).toBe(11)
  })

  test('minimumLeaf', () => {
    expect(minimumLeaf(Number.Order)(numericTree)).toBe(3)
  })

  test('maximumLeaf', () => {
    expect(maximumLeaf(Number.Order)(numericTree)).toBe(10)
  })

  test('minimumLeafAndParent', () => {
    expect(minimumLeafAndParent(Number.Order)(numericTree)).toEqual([
      3,
      Option.some(2),
    ])
  })

  test('maximumLeafAndParent', () => {
    expect(maximumLeafAndParent(Number.Order)(numericTree)).toEqual([
      10,
      Option.some(1),
    ])
  })
})
