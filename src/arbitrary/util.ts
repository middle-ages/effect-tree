import {unwords} from '#String'
import type {NonEmptyArray} from 'effect/Array'
import fc from 'fast-check'

/**
 * @category internal
 */
export const voidArbitrary: fc.Arbitrary<void> = fc.constant(void {})

/**
 * @category internal
 */
export const nonEmptyArrayArbitrary = <T>(
  arb: fc.Arbitrary<T>,
  options?: Partial<{minLength: number; maxLength: number}>,
) => {
  const {minLength = 1, maxLength = 5} = options ?? {}
  return fc.array(arb, {minLength, maxLength}) as fc.Arbitrary<NonEmptyArray<T>>
}

/**
 * @category internal
 */
export const codePointArbitrary = (min: number, max: number) =>
  fc.integer({min, max}).map(n => String.fromCodePoint(n))

/**
 * @category internal
 */
export const upperCaseArbitrary: fc.Arbitrary<string> = codePointArbitrary(
  65,
  90,
)

/**
 * @category internal
 */
export const lowerCaseArbitrary: fc.Arbitrary<string> = codePointArbitrary(
  97,
  122,
)

/**
 * @category internal
 */
export const letterArbitrary: fc.Arbitrary<string> = fc
  .boolean()
  .chain(isUpperCase => (isUpperCase ? upperCaseArbitrary : lowerCaseArbitrary))

/**
 * @category internal
 */
export const tinyLettersArbitrary: fc.Arbitrary<string[]> = fc.array(
  letterArbitrary,
  {minLength: 0, maxLength: 3},
)

/**
 * @category internal
 */
export const tinyLetterStringArbitrary: fc.Arbitrary<string> =
  tinyLettersArbitrary.map(unwords)

/**
 * @category internal
 */
export const tinyNonEmptyLettersArbitrary = fc.array(letterArbitrary, {
  minLength: 1,
  maxLength: 3,
}) as fc.Arbitrary<NonEmptyArray<string>>

/**
 * @category internal
 */
export const tinyNonEmptyLetterStringArbitrary: fc.Arbitrary<string> =
  tinyNonEmptyLettersArbitrary.map(unwords)
