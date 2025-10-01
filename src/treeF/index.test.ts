import {describe, expect, test} from 'vitest'
import {branchF, getBranchForest, leafF, setForest} from './index.js'

describe('branchF', () => {
  test('tupled', () => {
    expect(branchF.tupled([42, ['foo']])).toEqual(branchF(42, ['foo']))
  })

  test('curried', () => {
    expect(branchF(42, ['foo'])).toEqual(branchF(['foo'])(42))
  })

  test('tupled', () => {
    expect(branchF.tupled([42, ['foo']])).toEqual(branchF(['foo'])(42))
  })

  test('flipped', () => {
    expect(branchF.flipped(['foo'], 42)).toEqual(branchF(['foo'])(42))
  })

  test('flipped curried', () => {
    expect(branchF.flipped(42)(['foo'])).toEqual(branchF(['foo'])(42))
  })
})

test('getBranchForest', () => {
  expect(getBranchForest(branchF(42, ['foo']))).toEqual(['foo'])
})

describe('setForest', () => {
  test('leafF', () => {
    expect(setForest(['foo'], leafF(42))).toEqual(branchF(42, ['foo']))
  })

  test('branch', () => {
    expect(setForest(['bar'], branchF(42, ['foo']))).toEqual(
      branchF(42, ['bar']),
    )
  })
})
