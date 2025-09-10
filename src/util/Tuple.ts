import {Equivalence, Array} from 'effect'
import type {TupleOf, UnionToIntersection} from 'effect/Types'
import {getEquivalence as _getEquivalence} from 'effect/Tuple'

export * from 'effect/Tuple'

/** A tuple of arity-3 of type `A`. */
export type Tuple3<A> = readonly [A, A, A]

/** A tuple of arity-4 of type `A`. */
export type Tuple4<A> = readonly [A, A, A, A]

/**
 * Drop the last element of a tuple.
 *
 * ```ts
 * const myTuple = [1, 'a', true] as const
 * type NumberString = DropLast<typeof myTuple>
 * // NumberString ≡ readonly [1, 'a']
 * ```
 */
export type Init<Tuple extends readonly [unknown, ...(readonly unknown[])]> =
  Tuple extends readonly [...infer Init extends readonly unknown[], unknown]
    ? Readonly<Init>
    : never

/**
 * ```ts
 * type Foo = [string, number, RegExp[]];
 * type Res = Tail<Foo>; // [number, RegExp[]]
 * ```
 */
export type Tail<A extends readonly unknown[]> = A['length'] extends 0
  ? never
  : A extends readonly [unknown, ...infer Tail extends readonly unknown[]]
    ? Readonly<Tail>
    : never

/**
 * For example:
 *
 * ```ts
 * UnionToTuple<true | 42 | 'hello'> ≡ [true, 42, 'hello']
 * ```
 */
export type UnionToTuple<Union, Tuple extends readonly unknown[] = []> = [
  Union,
] extends [UnionToIntersection<Union>]
  ? readonly [Union, ...Tuple]
  : UnionToTuple<
      Exclude<Union, PopUnion<Union>>,
      readonly [PopUnion<Union>, ...Tuple]
    >

type PopUnion<U> =
  UnionToIntersection<U extends unknown ? (f: U) => void : never> extends (
    a: infer A,
  ) => void
    ? A
    : never

export const map =
  <T, U>(f: (t: T) => U) =>
  <N extends number>(t: Readonly<TupleOf<N, T>>): Readonly<TupleOf<N, U>> =>
    Array.map(f)(t) as TupleOf<N, U>

export const map3 =
  <T, U>(f: (t: T) => U) =>
  (t: Readonly<TupleOf<3, T>>): Readonly<TupleOf<3, U>> =>
    map(f)<3>(t)

export const map4 =
  <T, U>(f: (t: T) => U) =>
  (t: Readonly<TupleOf<4, T>>): Readonly<TupleOf<4, U>> =>
    map(f)<4>(t)

export const getEquivalence = Object.assign(_getEquivalence, {
  removeReadOnly: _getEquivalence as <
    T extends readonly Equivalence.Equivalence<any>[],
  >(
    ...isEquivalents: T
  ) => Equivalence.Equivalence<{
    [I in keyof T]: [T[I]] extends [Equivalence.Equivalence<infer A>]
      ? A
      : never
  }>,
})
