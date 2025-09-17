import {Arrays} from '#codec'
import {numericTree} from '#test'
import {of} from '#tree'
import {describe, expect, test} from 'vitest'
import {leafF} from '../../treeF.js'

describe('encode', () => {
  test('leaf', () => {
    expect(Arrays.encode(of('A'))).toBe('A')
  })

  test('numeric tree', () => {
    expect(Arrays.encode(numericTree)).toEqual([
      1,
      [[2, [3, 4, 5]], [6, [7, 8, [11, [9]]]], 10],
    ])
  })
})

describe('decode', () => {
  test('leaf', () => {
    expect(Arrays.decode('A')).toEqual(of('A'))
  })

  test('numeric tree', () => {
    expect(
      Arrays.decode([1, [[2, [3, 4, 5]], [6, [7, 8, [11, [9]]]], 10]]),
    ).toEqual(numericTree)
  })
})

test('throws encoding trees of an underlying array type', () => {
  expect(() => Arrays.unsafeEncodeFold(leafF([]))).toThrow()
})
