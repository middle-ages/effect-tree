import {unfoldLevelTree} from '#ops'
import {from, leaf} from '#tree'
import {identity, Predicate} from 'effect'
import {describe, expect, test} from 'vitest'
import {eqv, every, everyOf, some, someOf, xor} from './Foldable.js'

describe('Foldable', () => {
  {
    const isEven: Predicate.Predicate<number> = n => n % 2 === 0,
      isPositive: Predicate.Predicate<number> = n => n > 0,
      isNotPositive: Predicate.Predicate<number> = Predicate.not(isPositive),
      self = unfoldLevelTree({depth: 3, degree: identity})(1)

    describe('everyOf', () => {
      test('false', () => {
        expect(everyOf(isEven)(self)).toEqual(false)
      })

      test('false', () => {
        expect(everyOf(isPositive)(self)).toEqual(true)
      })
    })

    describe('someOf', () => {
      test('false', () => {
        expect(someOf(isNotPositive)(self)).toEqual(false)
      })

      test('true', () => {
        expect(someOf(isEven)(self)).toEqual(true)
      })
    })
  }

  {
    const trueTree = from(true, leaf(true)),
      falseLeaf = leaf(false),
      falseTree = from(false, falseLeaf),
      mixedTree = from(true, falseLeaf, falseTree)

    describe('true tree', () => {
      test('every=true', () => {
        expect(every(trueTree)).toEqual(true)
      })

      test('some=true', () => {
        expect(some(trueTree)).toEqual(true)
      })

      test('xor=false', () => {
        expect(xor(trueTree)).toEqual(false)
      })

      test('eqv=true', () => {
        expect(eqv(trueTree)).toEqual(true)
      })
    })

    describe('false leaf', () => {
      test('every=false', () => {
        expect(every(falseLeaf)).toEqual(false)
      })

      test('some=false', () => {
        expect(some(falseLeaf)).toEqual(false)
      })

      test('xor=true', () => {
        expect(xor(falseLeaf)).toEqual(false)
      })

      test('eqv=true', () => {
        expect(eqv(falseLeaf)).toEqual(false)
      })
    })

    describe('false tree', () => {
      test('every=false', () => {
        expect(every(falseTree)).toEqual(false)
      })

      test('some=false', () => {
        expect(some(falseTree)).toEqual(false)
      })

      test('xor=true', () => {
        expect(xor(falseTree)).toEqual(false)
      })

      test('eqv=true', () => {
        expect(eqv(falseTree)).toEqual(true)
      })
    })

    describe('mixed tree', () => {
      test('every=false', () => {
        expect(every(mixedTree)).toEqual(false)
      })

      test('some=false', () => {
        expect(some(mixedTree)).toEqual(true)
      })

      test('xor=true', () => {
        expect(xor(mixedTree)).toEqual(true)
      })

      test('eqv=true', () => {
        expect(eqv(mixedTree)).toEqual(false)
      })
    })
  }
})
