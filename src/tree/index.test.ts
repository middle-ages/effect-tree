import {
  branch,
  drill,
  firstChild,
  from,
  getBranchForest,
  getForest,
  getValue,
  isBranch,
  isLeaf,
  lastChild,
  leaf,
  length,
  modBranch,
  modBranchForest,
  modForest,
  modValue,
  nthChild,
  removeForest,
  setForest,
  setValue,
  tree,
} from '#tree'
import * as TreeF from '#treeF'
import {Array, pipe} from 'effect'
import {none, some} from 'effect/Option'
import {describe, expect, test} from 'vitest'
import {numericTree} from '../test.js'
import type {Tree} from './types.js'

const [leaf42, leaf43, leaf44] = [leaf(42), leaf(43), tree(44)]

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

  test('curried', () => {
    expect(tree.curried([leaf43])(42)).toEqual(tree(42, [leaf43]))
  })

  test('flipped', () => {
    expect(tree.flipped(42)([leaf43])).toEqual(tree(42, [leaf43]))
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

  test('getValue', () => {
    expect(getValue(leaf43)).toBe(43)
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
      expect(setValue(leaf42, 43)).toEqual(leaf43)
    })

    test('curried', () => {
      expect(setValue(44)(tree(42, [leaf43]))).toEqual(tree(44, [leaf43]))
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

    test('flip', () => {
      expect(setForest.flip(tree(42, [leaf43]))([leaf44])).toEqual(
        branch(42, [leaf44]),
      )
    })
  })

  test('modNode', () => {
    expect(modValue((x: number) => x + 1)(tree(42, [leaf44]))).toEqual(
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

    test('flip', () => {
      expect(nthChild.flip(0)(from(42, leaf(43)))).toEqual(some(leaf(43)))
    })
  })

  test('firstChild', () => {
    expect(firstChild(branch(1, [leaf(2), leaf(3)]))).toEqual(leaf(2))
  })

  describe('modBranch', () => {
    test('leaf', () => {
      expect(
        pipe(
          leaf(1),
          modBranch(branch => removeForest(branch)),
        ),
      ).toEqual(leaf(1))
    })

    test('branch', () => {
      expect(
        pipe(
          branch(1, [leaf(2), leaf(3)]),
          modBranch(branch => removeForest(branch)),
        ),
      ).toEqual(leaf(1))
    })
  })

  test('lastChild', () => {
    expect(lastChild(branch(1, [leaf(2), leaf(3)]))).toEqual(leaf(3))
  })

  test('leaf length', () => {
    expect(length(leaf(1))).toBe(0)
  })

  describe('drill', () => {
    test('no indexes', () => {
      expect(drill([], leaf(42))).toEqual(none())
    })

    describe('one level', () => {
      describe('not found', () => {
        test('index>0', () => {
          expect(drill([1], leaf(42))).toEqual(none())
        })

        test('index=0', () => {
          expect(drill([0], leaf(42))).toEqual(none())
        })

        test('index<0', () => {
          expect(drill([-1], leaf(42))).toEqual(none())
        })
      })

      describe('found', () => {
        test('from start', () => {
          expect(drill([0], from(42, leaf(43)))).toEqual(some(leaf(43)))
        })
        test('from end', () => {
          expect(drill([-1], from(42, leaf(43)))).toEqual(some(leaf(43)))
        })
      })
    })

    describe('two levels', () => {
      const self = from(1, from(2, leaf(3)), from(4, leaf(5), leaf(6)))
      describe('not found', () => {
        test('leaf', () => {
          expect(drill([0], leaf(42))).toEqual(none())
        })

        describe('branch', () => {
          test('from start', () => {
            expect(drill([1, 2], self)).toEqual(none())
          })

          test('from end', () => {
            expect(drill([-2, -3], self)).toEqual(none())
          })
        })
      })

      describe('found', () => {
        test('leaf', () => {
          expect(drill([1, 0], self)).toEqual(some(leaf(5)))
        })

        test('mixed from start + from end', () => {
          expect(drill([-2, 2, -1], numericTree)).toEqual(some(leaf(9)))
        })
      })
    })

    test('flip', () => {
      expect(pipe(numericTree, drill.flip([-2, -1, -1]))).toEqual(some(leaf(9)))
    })
  })
})
