import {PartF} from '#arbitrary'
import {testConcreteTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe} from 'vitest'
import {
  AlignedEquivalence,
  HorizontalEquivalence,
  VerticalEquivalence,
} from './data.js'

const {AlignedArbitrary, HorizontalArbitrary, VerticalArbitrary} = PartF

describe('horizontally aligned', () => {
  testConcreteTypeclassLaws(
    {Equivalence: VerticalEquivalence},
    {a: VerticalArbitrary, equalsA: VerticalEquivalence},
  )
})

describe('horizontally aligned', () => {
  testConcreteTypeclassLaws(
    {Equivalence: HorizontalEquivalence},
    {a: HorizontalArbitrary, equalsA: HorizontalEquivalence},
  )
})

describe('aligned', () => {
  testConcreteTypeclassLaws(
    {Equivalence: AlignedEquivalence},
    {a: AlignedArbitrary, equalsA: AlignedEquivalence},
  )
})
