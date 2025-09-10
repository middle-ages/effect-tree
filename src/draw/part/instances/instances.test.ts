import {testConcreteTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe} from 'vitest'
import {Arbitrary} from '../../../arbitrary/Part.js'
import {Equivalence} from './Equivalence.js'

describe('Part typeclass laws', () => {
  testConcreteTypeclassLaws(
    {Equivalence},
    {a: Arbitrary(), equalsA: Equivalence},
    {numRuns: 30},
  )
})
