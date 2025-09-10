import * as TreeF from '#treeF'
import {Array} from 'effect'
import {none, some} from 'effect/Option'
import {describe, expect, test} from 'vitest'
import {
  branch,
  from,
  getBranchForest,
  nthChild,
  getChildAtPath,
  getForest,
  getNode,
  isBranch,
  isLeaf,
  leaf,
  length,
  modBranchForest,
  modForest,
  modNode,
  setForest,
  setNode,
  tree,
  withForest,
  firstChild,
  lastChild,
} from './index.js'
import type {Tree} from './types.js'

const [leaf42, leaf43, leaf44] = [leaf(42), leaf(43), leaf(44)]

describe('tree api', () => {
  test('leaf', () => {
    expect(leaf42).toEqual(tree(42, []))
  })

  describe('branch', () => {
    test('binary', () => {
      expect(branch(42, [leaf43])).toEqual(tree(42, [leaf43]))
    })

    test('curried', () => {
      expect(branch([leaf43])(42)).toEqual(tree(42, [leaf43]))
    })
  })

  describe('withForest', () => {
    test('binary', () => {
      expect(withForest([leaf43], 42)).toEqual(tree(42, [leaf43]))
    })

    test('curried', () => {
      expect(withForest(42)([leaf43])).toEqual(tree(42, [leaf43]))
    })
  })

  test('tree', () => {
    expect(tree(42, [leaf43])).toEqual({
      unfixed: TreeF.branchF(42, [leaf43]),
    })
  })

  test('from', () => {
    expect(from(42, leaf43)).toEqual(tree(42, [leaf43]))
  })

  describe('isLeaf', () => {
    test('true', () => {
      expect(isLeaf(leaf42)).toBe(true)
    })

    test('false', () => {
      expect(isLeaf(from(42, leaf43))).toBe(false)
    })
  })

  describe('isBranch', () => {
    test('tue', () => {
      expect(isBranch(from(42, leaf43))).toBe(true)
    })

    test('false', () => {
      expect(isBranch(leaf42 as Tree<number>)).toBe(false)
    })
  })

  test('length', () => {
    expect(length(from(42, leaf43))).toBe(1)
  })

  test('getNode', () => {
    expect(getNode(leaf43)).toBe(43)
  })

  test('getBranchForest', () => {
    expect(getBranchForest(branch(42, [leaf43]))).toEqual([leaf43])
  })

  describe('getForest', () => {
    test('leaf', () => {
      expect(getForest(leaf42)).toEqual([])
    })

    test('branch', () => {
      expect(getForest(tree(42, [leaf43]))).toEqual([leaf43])
    })
  })

  describe('setNode', () => {
    test('binary', () => {
      expect(setNode(leaf42, 43)).toEqual(leaf43)
    })

    test('curried', () => {
      expect(setNode(44)(tree(42, [leaf43]))).toEqual(tree(44, [leaf43]))
    })
  })

  describe('setForest', () => {
    test('binary', () => {
      expect(setForest(leaf42, [leaf43])).toEqual(tree(42, [leaf43]))
    })

    test('curried', () => {
      expect(setForest([leaf44])(tree(42, [leaf43]))).toEqual(
        branch(42, [leaf44]),
      )
    })
  })

  test('modNode', () => {
    expect(modNode((x: number) => x + 1)(tree(42, [leaf44]))).toEqual(
      tree(43, [leaf44]),
    )
  })

  test('modForest', () => {
    expect(modForest<number>(Array.append(leaf44))(tree(42, [leaf43]))).toEqual(
      tree(42, [leaf43, leaf44]),
    )
  })

  test('modBranchForest', () => {
    expect(
      modBranchForest<number>(Array.append(leaf44))(branch(42, [leaf43])),
    ).toEqual(tree(42, [leaf43, leaf44]))
  })

  describe('getNthChild', () => {
    test('not found', () => {
      expect(nthChild(0, leaf(42))).toEqual(none())
    })

    test('found', () => {
      expect(nthChild(0, from(42, leaf(43)))).toEqual(some(leaf(43)))
    })
  })

  test('firstChild', () => {
    expect(firstChild(branch(1, [leaf(2), leaf(3)]))).toEqual(leaf(2))
  })

  test('lastChild', () => {
    expect(lastChild(branch(1, [leaf(2), leaf(3)]))).toEqual(leaf(3))
  })

  describe('getChildAtPath', () => {
    describe('one level', () => {
      test('not found', () => {
        expect(getChildAtPath([0], leaf(42))).toEqual(none())
      })

      test('found', () => {
        expect(getChildAtPath([0], from(42, leaf(43)))).toEqual(some(leaf(43)))
      })
    })

    describe('two levels', () => {
      const self = from(1, from(2, leaf(3)), from(4, leaf(5), leaf(6)))
      describe('not found', () => {
        test('leaf', () => {
          expect(getChildAtPath([0], leaf(42))).toEqual(none())
        })

        test('branch', () => {
          expect(getChildAtPath([1, 2], self)).toEqual(none())
        })
      })

      describe('not found', () => {
        test('leaf', () => {
          expect(getChildAtPath([1, 0], self)).toEqual(some(leaf(5)))
        })
      })
    })
  })
})
