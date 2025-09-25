import {Edges} from '#codec'
import {branch, of, type Tree} from '#tree'
import type {Pair} from '#Pair'
import {HashMap, HashSet} from 'effect'
import {describe, expect, test} from 'vitest'

interface Expected {
  roots: number[]
  toParent: Pair<number>[]
  toChildren: [number, number[]][]
}

const testMap = (
  name: string,
  tree: Tree<number>,
  {roots, toParent, toChildren}: Expected,
) =>
  describe(name, () => {
    const actual = Edges.index(tree)
    test('roots', () => {
      expect([...HashSet.values(actual.roots)]).toEqual(roots)
    })
    test('toParent', () => {
      expect([...HashMap.entries(actual.toParent)]).toEqual(toParent)
    })
    test('toChildren', () => {
      expect([...HashMap.entries(actual.toChildren)]).toEqual(toChildren)
    })
  })

describe('EdgeMap', () => {
  describe('index', () => {
    testMap('nodeCount≔1', of(1), {
      roots: [1],
      toParent: [],
      toChildren: [],
    })
    testMap('nodeCount≔2', branch(1, [of(2)]), {
      roots: [1],
      toParent: [[2, 1]],
      toChildren: [[1, [2]]],
    })
    testMap('nodeCount≔4', branch(1, [of(2), branch(3, [of(4)])]), {
      roots: [1],
      toParent: [
        [2, 1],
        [3, 1],
        [4, 3],
      ],
      toChildren: [
        [1, [2, 3]],
        [3, [4]],
      ],
    })
  })
})
