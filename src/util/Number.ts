import {Array as EArray, Predicate} from 'effect'
import type {NonEmptyArray} from 'effect/Array'

export * from 'effect/Number'

/**
 * Convert the bigint decimal `n` to base `b`.
 */
export const toRadix = (n: bigint, base: number): NonEmptyArray<number> => {
  const bigBase: bigint = BigInt(base)
  let quotient: bigint = n / bigBase
  const digits: NonEmptyArray<number> = [Number(n % bigBase)]

  while (quotient > 0) {
    digits.unshift(Number(quotient % bigBase))
    quotient = quotient / bigBase
  }

  return digits
}

/** Convert `n` given as a list of digits in base `b` to decimal. */
export const fromRadix = (ns: readonly number[], base: number): bigint => {
  const bigBase = BigInt(base)

  let pow = 0n,
    sum = 0n
  for (const n of EArray.reverse(ns)) sum += BigInt(n) * bigBase ** pow++

  return sum
}

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

/**
 * Cut a number into two equal sized integers, with the first getting the
 * remainder if the given number is not even.
 */
export const halfToFirst = (n: number): [number, number] => {
  const [quotient, remainder] = floorMod2(n)
  return [quotient + remainder, quotient]
}

/**
 * Cut a number into two equal sized integers, with the second getting the
 * remainder if the given number is not even.
 */
export const halfToSecond = (n: number): [number, number] => {
  const [quotient, remainder] = floorMod2(n)
  return [quotient, quotient + remainder]
}
