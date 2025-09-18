import {type HStrut, type VStrut} from '#draw'
import fc from 'fast-check'
import {
  tinyLettersArbitrary,
  tinyLetterStringArbitrary,
  tinyNonEmptyLettersArbitrary,
} from './util.js'

export const hStrutArbitrary: fc.Arbitrary<HStrut> = fc.record({
  axis: fc.constant('horizontal'),
  prefix: tinyLetterStringArbitrary,
  body: tinyNonEmptyLettersArbitrary,
  suffix: tinyLetterStringArbitrary,
})

export const vStrutArbitrary: fc.Arbitrary<VStrut> = fc.record({
  axis: fc.constant('vertical'),
  prefix: tinyLettersArbitrary,
  body: tinyNonEmptyLettersArbitrary,
  suffix: tinyLettersArbitrary,
})
