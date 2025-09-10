import {Either, identity, pipe, Tuple} from 'effect'

export type Pair<A> = readonly [A, A]

/** Run a pair of functions on the same value and return the result tuple. */
export const fanout =
  <A, B, C>(ab: (a: A) => B, ac: (a: A) => C) =>
  (a: A): readonly [B, C] => [ab(a), ac(a)]

/**
 * Convert a pair of functions into a function that runs the first on left and
 * the second on right.
 */
export const fanin = <A, B, C>(
  ba: (b: B) => A,
  ca: (c: C) => A,
): ((either: Either.Either<C, B>) => A) =>
  Either.match({onLeft: ba, onRight: ca})

/** Map over both members of a pair with a single function. */
export const pairMap =
  <C, A, B = A>(ab: (a: A | B) => C) =>
  ([a1, b1]: [A, B]): Pair<C> => [ab(a1), ab(b1)]

/** Create a pair of type `readonly [A, B]`. */
export const pair = <A, B>(a: A, b: B): readonly [A, B] => [a, b]

pair.removeReadOnly = <A, B>(a: A, b: B): [A, B] => [a, b]

/** A curried version of {@link pair}. */
pair.withFirst =
  <A>(first: A) =>
  <B>(second: B): readonly [A, B] => [first, second]

const withSecond =
  <A>(second: A) =>
  <B>(first: B): readonly [B, A] => [first, second]

withSecond.removeReadOnly =
  <A>(second: A) =>
  <B>(first: B): [B, A] => [first, second]

/** A flipped curried version of {@link pair}. */
pair.withSecond = withSecond

/** Duplicate the given value to form a pair of `A`. */
export const square = <A>(a: A): Pair<A> => [a, a]

/**
 * Duplicate the given value and run the first value through the given
 * function.
 */
square.mapFirst =
  <A, B>(f: (a: A) => B) =>
  (o: A): readonly [B, A] =>
    pipe(o, square, Tuple.mapFirst(f))

/**
 * Duplicate the given value and run the second value through the given
 * function.
 */
square.mapSecond =
  <A, B>(f: (a: A) => B) =>
  (o: A): readonly [A, B] =>
    pipe(o, square, Tuple.mapSecond(f))

/**
 * Given a tuple `[A, (a: A) ⇒ B]` applies the function and return the result.
 */
export const applyPair = <A, B>([a, f]: readonly [A, (a: A) => B]): B => f(a)

/** Flatten a pair of pairs into a 4-tuple. */
export const flatten = <A, B, C, D>([[a, b], [c, d]]: readonly [
  [A, B],
  [C, D],
]): readonly [A, B, C, D] => [a, b, c, d] as const

export const swap = <A, B>([a, b]: readonly [A, B]): readonly [B, A] => [b, a]

/** Swap the given pair only if the flag is true. */
export const swapIf: (
  flag: boolean,
) => <const A>(pair: Pair<A>) => typeof pair = flag =>
  flag ? Tuple.swap : identity

/** Swap the given pair only if the flag is false. */
export const swapUnless: (
  flag: boolean,
) => <const A>(pair: Pair<A>) => typeof pair = flag => swapIf(!flag)
