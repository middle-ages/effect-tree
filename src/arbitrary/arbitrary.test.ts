import {getArbitrary, getNumberedArbitrary} from '#arbitrary/Tree'
import {maximumNodeDegree, maximumNodeHeight} from '#ops'
import {drawTree} from '#test'
import {from, isLeaf, map, of, type Tree} from '#tree'
import {String, pipe} from '#util'
import {tinyInteger} from 'effect-ts-laws'
import fc from 'fast-check'
import {describe, expect, test} from 'vitest'

describe('arbitrary', () => {
  test('basic', () => {
    const arbitrary = getArbitrary(tinyInteger, {
      branchBias: 3 / 4,
      maxDepth: 3,
      maxChildren: 2,
    })

    const [actual] = fc.sample(arbitrary, {seed: 123})
    expect(actual).toEqual(from(-4, of(89), from(-96, of(92))))
  })

  test('honors max children', () => {
    const arbitrary = getArbitrary(tinyInteger, {
      branchBias: 3 / 4,
      maxDepth: 3,
      maxChildren: 3,
    })

    fc.assert(
      fc.property(arbitrary, tree => {
        expect(maximumNodeDegree(tree)).toBeLessThanOrEqual(3)
      }),
    )
  })

  test('honors max depth', () => {
    const arbitrary = getArbitrary(tinyInteger, {
      branchBias: 4 / 5,
      maxDepth: 4,
      maxChildren: 2,
    })

    fc.assert(
      fc.property(arbitrary, tree => {
        expect(maximumNodeHeight(tree)).toBeLessThanOrEqual(4)
      }),
    )
  })

  test('honors onlyBranches flag', () => {
    const arbitrary = getArbitrary(tinyInteger, {
      branchBias: 1 / 8,
      onlyBranches: true,
      maxDepth: 2,
      maxChildren: 2,
    })

    fc.assert(
      fc.property(arbitrary, tree => {
        expect(isLeaf(tree)).toBe(false)
      }),
    )
  })

  test('honors branch bias=0', () => {
    const arbitrary = getArbitrary(tinyInteger, {
      branchBias: 0,
      maxDepth: 4,
      maxChildren: 4,
    })

    fc.assert(
      fc.property(arbitrary, tree => {
        expect(isLeaf(tree)).toBe(true)
      }),
    )
  })

  test('numbered arbitrary', () => {
    const [actual] = fc.sample(
      getNumberedArbitrary({
        maxDepth: 3,
        maxChildren: 3,
        branchBias: 1 / 2,
        onlyBranches: true,
      }),
      {numRuns: 1, seed: 42},
    )
    const drawn = pipe(actual as Tree<number>, map(String.fromNumber), drawTree)

    expect(drawn).toBe(`
┬1
└┬2
 ├─3
 └─4`)
  })
})
