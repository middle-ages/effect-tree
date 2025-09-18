import {
  AlignedArbitrary,
  HorizontalArbitrary,
  VerticalArbitrary,
} from '#arbitrary/PartF'
import {testConcreteTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe} from 'vitest'
import {
  AlignedEquivalence,
  AlignedOrder,
  HorizontalEquivalence,
  HorizontalOrder,
  VerticalEquivalence,
  VerticalOrder,
} from './data.js'

describe('horizontally aligned', () => {
  testConcreteTypeclassLaws(
    {Order: VerticalOrder, Equivalence: VerticalEquivalence},
    {a: VerticalArbitrary, equalsA: VerticalEquivalence},
  )
})

describe('horizontally aligned', () => {
  testConcreteTypeclassLaws(
    {Order: HorizontalOrder, Equivalence: HorizontalEquivalence},
    {a: HorizontalArbitrary, equalsA: HorizontalEquivalence},
  )
})

describe('aligned', () => {
  testConcreteTypeclassLaws(
    {Order: AlignedOrder, Equivalence: AlignedEquivalence},
    {a: AlignedArbitrary, equalsA: AlignedEquivalence},
  )
})
