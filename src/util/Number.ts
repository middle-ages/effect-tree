import {Array, pipe, Predicate} from 'effect'
import type {NonEmptyArray} from 'effect/Array'

export * from 'effect/Number'

/**
 * Convert the decimal number `n` to base `b`.
 * Thanks to _Nitsan BenHanoch_.
 */
export const toRadix = (
  n: number,
  base: number,
): Array.NonEmptyArray<number> => {
  const max = Math.floor(Math.log(n) / Math.log(base)),
    result: number[] = []

  let x = n
  for (let pow = max; pow >= 0; pow--) {
    const bpw = base ** pow,
      digit = Math.floor(x / bpw)
    x -= digit * bpw
    result.push(digit)
  }

  return pipe(result, fromArrayOr([0]))
}

/** Convert `n` given as a list of digits in base `b` to decimal. */
export const fromRadix = (ns: readonly number[], base: number): number => {
  let pow = 0,
    sum = 0
  for (const n of Array.reverse(ns)) sum += n * base ** pow++
  return sum
}

const fromArrayOr =
  <A>(fallback: NonEmptyArray<A>) =>
  ([head, ...tail]: readonly A[]): NonEmptyArray<A> =>
    head === undefined ? fallback : ([head, ...tail] as NonEmptyArray<A>)

export const floorMod = (
  dividend: number,
  divisor: number,
): [quotient: number, remainder: number] => [
  Math.floor(dividend / divisor),
  dividend % divisor,
]

export const floorMod2 = (
    dividend: number,
  ): [quotient: number, remainder: number] => floorMod(dividend, 2),
  isPositive: Predicate.Predicate<number> = n => n > 0,
  isNonZero: Predicate.Predicate<number> = n => n !== 0,
  isZero: Predicate.Predicate<number> = n => n === 0,
  isEven: Predicate.Predicate<number> = n => n % 2 === 0,
  isOdd: Predicate.Predicate<number> = n => n % 2 !== 0,
  isNegative: Predicate.Predicate<number> = n => n < 0,
  isEqual: (self: number) => Predicate.Predicate<number> = self => that =>
    self === that
