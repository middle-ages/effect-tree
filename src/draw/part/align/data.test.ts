import {testConcreteTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe} from 'vitest'
import {
  AlignedArbitrary,
  AlignedEquivalence,
  AlignedOrder,
  HorizontalArbitrary,
  HorizontalEquivalence,
  HorizontalOrder,
  VerticalArbitrary,
  VerticalEquivalence,
  VerticalOrder,
} from './data.js'

describe('aligned order and equivalence', () => {
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
})
