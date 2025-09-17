import {from, of} from '#tree'
import {
  fromTree,
  getDepth,
  getFocus,
  getForest,
  getValue,
  hasLefts,
  head,
  isLeaf,
  isRoot,
  last,
} from '#zipper'
import {pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {binaryTree} from '../ops.js'

const deep = pipe(6, binaryTree, fromTree, head, head, head, head, head)
test('getFocus', () => {
  expect(getFocus(deep)).toEqual(of(6))
})

test('getDepth', () => {
  expect(getDepth(deep)).toBe(6 - 1)
})

test('getValue', () => {
  expect(pipe(from(1, of(2), of(3)), fromTree, last, getValue)).toBe(3)
})

test('getForest', () => {
  expect(pipe(from(1, of(2), of(3)), fromTree, getForest)).toEqual([
    of(2),
    of(3),
  ])
})

describe('isLeaf', () => {
  test('leaf', () => {
    expect(pipe(of(1), fromTree, isLeaf)).toBe(true)
  })

  test('branch', () => {
    expect(pipe(from(1, of(2)), fromTree, isLeaf)).toBe(false)
  })
})

describe('root', () => {
  test('true', () => {
    expect(pipe(of(1), fromTree, isRoot)).toBe(true)
  })

  test('false', () => {
    expect(pipe(from(1, of(2)), fromTree, head, isRoot)).toBe(false)
  })
})

describe('hasLefts', () => {
  test('false', () => {
    expect(pipe(from(1, of(2)), fromTree, last, hasLefts)).toBe(false)
  })

  test('true', () => {
    expect(pipe(from(1, of(2), of(3)), fromTree, last, hasLefts)).toBe(true)
  })
})
