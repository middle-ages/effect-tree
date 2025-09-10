import type {NonEmptyArray} from 'effect/Array'
import fc from 'fast-check'

export const voidArbitrary: fc.Arbitrary<void> = fc.constant(void {})

export const nonEmptyArrayArbitrary = <T>(
  arb: fc.Arbitrary<T>,
  options?: Partial<{minLength: number; maxLength: number}>,
) => {
  const {minLength = 1, maxLength = 5} = options ?? {}
  return fc.array(arb, {minLength, maxLength}) as fc.Arbitrary<NonEmptyArray<T>>
}
