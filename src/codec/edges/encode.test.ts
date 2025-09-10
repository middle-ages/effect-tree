import {Edges} from '#codec'
import {branch, of} from '#tree'
import {Option} from 'effect'
import {describe, expect, test} from 'vitest'

describe('edges encode', () => {
  test('nodeCount≔1', () => {
    expect(Edges.encode(of(1))).toEqual([[1, Option.none()]])
  })

  test('nodeCount≔3', () => {
    expect(Edges.encode(branch(1, [of(2), of(3)]))).toEqual([
      [1, Option.none()],
      [2, Option.some(1)],
      [3, Option.some(1)],
    ])
  })

  test('nodeCount≔4', () => {
    const actual = Edges.encode(branch(1, [of(2), branch(3, [of(4)])]))
    expect(actual).toEqual([
      [1, Option.none()],
      [2, Option.some(1)],
      [3, Option.some(1)],
      [4, Option.some(3)],
    ])
  })
})
