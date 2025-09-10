import {Traversable as TA} from '@effect/typeclass'
import {Applicative as ArrayApplicative} from '@effect/typeclass/data/Array'
import {Applicative as OptionApplicative} from '@effect/typeclass/data/Option'
import {Option, pipe} from 'effect'
import {monoEquivalence} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe, expect, test} from 'vitest'
import {text} from '../data.js'
import {columnF, type PartF, type PartFTypeLambda} from './data.js'
import {Covariant, getEquivalence, Traversable} from './instances.js'
import {getArbitrary} from '#arbitrary/PartF'

describe('partF', () => {
  const makeColumn = columnF('left', text('•'))

  describe('sequence', () => {
    test('array', () => {
      const actual: readonly PartF<number>[] = pipe(
        [[1, 2, 3]],
        makeColumn,
        TA.sequence(Traversable)(ArrayApplicative),
      )

      expect(actual).toEqual([
        makeColumn([1]),
        makeColumn([2]),
        makeColumn([3]),
      ])
    })

    describe('option', () => {
      const sequence = TA.sequence(Traversable)(OptionApplicative)

      test('some', () => {
        const actual: Option.Option<PartF<number>> = pipe(
          makeColumn<Option.Option<number>>([Option.some(1), Option.some(2)]),
          sequence,
        )

        expect(actual).toEqual(Option.some(makeColumn([1, 2])))
      })

      test('none', () => {
        const actual: Option.Option<PartF<number>> = pipe(
          makeColumn<Option.Option<number>>([Option.some(1), Option.none()]),
          sequence,
        )

        expect(actual).toEqual(Option.none())
      })
    })
  })

  describe('PartF typeclass laws', () => {
    testTypeclassLaws<PartFTypeLambda>({getEquivalence, getArbitrary})(
      {
        Covariant,
        Traversable,
        Equivalence: getEquivalence(monoEquivalence),
      },
      {numRuns: 20},
    )
  })
})
