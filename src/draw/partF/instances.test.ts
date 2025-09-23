import {getArbitrary} from '#arbitrary/PartF'
import {Traversable as TA} from '@effect/typeclass'
import {Applicative as ArrayApplicative} from '@effect/typeclass/data/Array'
import {Applicative as OptionApplicative} from '@effect/typeclass/data/Option'
import {Option, pipe} from 'effect'
import {monoEquivalence} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe, expect, test} from 'vitest'
import {HStrut} from '../struts.js'
import {columnF} from './data.js'
import {getEquivalence} from './Equivalence.js'
import {Covariant, Traversable} from './instances.js'
import {type PartF, type PartFTypeLambda} from './types.js'

const makeColumn = columnF({hAlign: 'left', left: HStrut(['•'])})

describe('sequence', () => {
  test('array', () => {
    const actual: readonly PartF<number>[] = pipe(
      [[1, 2, 3]],
      makeColumn,
      TA.sequence(Traversable)(ArrayApplicative),
    )

    expect(actual).toEqual([makeColumn([1]), makeColumn([2]), makeColumn([3])])
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
