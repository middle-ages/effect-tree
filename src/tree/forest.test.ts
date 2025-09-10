import {pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {
  append,
  appendAll,
  prepend,
  prependAll,
  removeNthChild,
  removeFirstChild,
  removeLastChild,
} from './forest.js'
import {from, leaf} from './index.js'
import {type Tree} from './types.js'

const aLeaf = leaf(1),
  aBranch = from(2, leaf(3)),
  childLeaf = leaf(4),
  childBranch = from(5, leaf(6)),
  aForest: Tree<number>[] = [childLeaf, childBranch],
  parent = from(7, ...aForest)

describe('forest', () => {
  describe('append', () => {
    test('leaf', () => {
      expect(pipe(7, leaf, append(aLeaf))).toEqual(from(7, aLeaf))
    })

    test('branch', () => {
      expect(pipe(aBranch, append(aLeaf))).toEqual(from(2, leaf(3), aLeaf))
    })
  })

  describe('prepend', () => {
    test('leaf', () => {
      expect(pipe(7, leaf, prepend(aLeaf))).toEqual(from(7, aLeaf))
    })

    test('branch', () => {
      expect(pipe(aBranch, prepend(aLeaf))).toEqual(from(2, aLeaf, leaf(3)))
    })
  })

  describe('appendAll', () => {
    test('leaf', () => {
      expect(pipe(aLeaf, appendAll(aForest))).toEqual(from(1, ...aForest))
    })

    test('branch', () => {
      expect(pipe(aBranch, appendAll(aForest))).toEqual(
        from(2, leaf(3), ...aForest),
      )
    })
  })

  describe('prependAll', () => {
    test('leaf', () => {
      expect(pipe(aLeaf, prependAll(aForest))).toEqual(from(1, ...aForest))
    })

    test('branch', () => {
      expect(pipe(aBranch, prependAll(aForest))).toEqual(
        from(2, ...aForest, leaf(3)),
      )
    })
  })

  describe('removeNthChild', () => {
    describe('not found', () => {
      test('out-of-bounds', () => {
        expect(removeNthChild(2, parent)).toEqual(parent)
      })
      test('leaf', () => {
        expect(removeNthChild(0, childLeaf)).toEqual(childLeaf)
      })
    })

    describe('found', () => {
      describe('positive index', () => {
        test('head', () => {
          expect(removeNthChild(0, parent)).toEqual(from(7, childBranch))
        })

        test('tail', () => {
          expect(removeNthChild(1, parent)).toEqual(from(7, childLeaf))
        })
      })

      describe('negative index', () => {
        test('head', () => {
          expect(removeNthChild(-2, parent)).toEqual(from(7, childBranch))
        })

        test('tail', () => {
          expect(removeNthChild(-1, parent)).toEqual(from(7, childLeaf))
        })
      })
    })
  })

  test('removeFirstChild', () => {
    expect(removeFirstChild(parent)).toEqual(from(7, childBranch))
  })

  test('removeLastChild', () => {
    expect(removeLastChild(parent)).toEqual(from(7, childLeaf))
  })
})
