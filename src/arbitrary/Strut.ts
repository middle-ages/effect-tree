import {HStrut, HStruts, VStrut, VStruts, type Struts} from '#draw'
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

export const hStrutsArbitrary: fc.Arbitrary<HStruts> = fc.record({
  right: hStrutArbitrary,
  left: hStrutArbitrary,
})

export const vStrutsArbitrary: fc.Arbitrary<VStruts> = fc.record({
  top: vStrutArbitrary,
  bottom: vStrutArbitrary,
})

export const strutsArbitrary: fc.Arbitrary<Struts> = fc
  .tuple(hStrutsArbitrary, vStrutsArbitrary)
  .map(([hStruts, vStruts]) => ({...hStruts, ...vStruts}))
