import {type NonEmptyArray, map} from 'effect/Array'
import {swap} from 'effect/Tuple'
import {type Simplify, type UnionToIntersection} from 'effect/Types'
import {type Tail, type UnionToTuple} from './Tuple.js'

/** `Object.keys` for literal records */
export const typedKeys = <const T extends object>(o: T): KeyList<T> =>
  Object.keys(o) as KeyList<T>

typedKeys.nonEmpty = <T extends Record<PropertyKey, unknown>>(o: T) =>
  Object.keys(o as object) as unknown as NonEmptyArray<keyof T>

/** `Object.values` for literal records */
export const typedValues = <const T extends object>(o: T) =>
  Object.values(o) as ValueList<T>

/** `Object.fromEntries` for literal records */
export const typedFromEntries = <
  const T extends readonly [...(readonly [PropertyKey, unknown][])],
>(
  entries: T,
) => Object.fromEntries(entries) as FromEntries<T>

/** Invert key/values of a literal object. */
export const invertLiteral = <T extends object>(o: T) =>
  Object.fromEntries(map(Object.entries(o), swap)) as InvertedObject<T>

/** Invert key/values of an object. */
export const invert = <K extends string, V extends string>(o: Record<K, V>) =>
  Object.fromEntries(map(Object.entries(o), swap)) as Record<V, K>

/**
 * For example:
 *
 * ```ts
 * ObjectToUnion<{a: number, b: boolean}> ≡ {a: number} | {b: boolean}
 * ```
 */
export type ObjectToUnion<T extends object> = {
  [K in keyof T]: Record<K, T[K]>
}[keyof T]

/**
 * Type of the key array of a literal record type
 *
 *
 * ```ts
 * interface Foo {
 *   a: number;
 *   b: string;
 * }
 *
 * type Keys = KeyList<Foo>; // ["a", "b"]
 * // Keys[number] ≡ keyof Foo
 * ```
 **/
export type KeyList<T extends object> = UnionToTuple<keyof T>

/**
 * The inverted object of `T`.
 *
 * ```ts
 * type ABC = {A: 'X'; B: 'Y', C: 'Z'}
 * type XYZ = InvertedObject<ABC> // {X: 'A'; Y: 'B', Z: 'C'}
 * ```
 */
export type InvertedObject<T extends object> = Readonly<
  UnionToIntersection<
    {
      [K in keyof T]: Record<T[K] & PropertyKey, K>
    }[keyof T]
  >
>

/**
 * ```ts
 * type MyObject = FromEntries<
 *   readonly [['a', number], ['b', RegExp], ['c', boolean]]
 * > ≡ {a: number; b: RegExp; c: boolean}
 * ```
 */
export type FromEntries<
  T extends readonly (readonly [PropertyKey, unknown])[],
> = Simplify<
  Readonly<
    UnionToIntersection<
      {
        [K in keyof T]: Record<T[K][0], T[K][1]>
      }[number]
    >
  >
>

/**
 * ```ts
 * interface Foo {
 *   a: number;
 *   b: string;
 * }
 * type Res = ValueList<Foo>; // [number, string]
 * ```
 */
export type ValueList<T extends object> = _ValueList<
  T,
  KeyList<T> & readonly PropertyKey[]
>

type _ValueList<
  Source extends object,
  Keys extends readonly PropertyKey[],
  Carry extends readonly unknown[] = [],
> = Keys['length'] extends 0
  ? Carry
  : _ValueList<
      Omit<Source, Keys[0]>,
      Tail<KeyList<Source>> & readonly PropertyKey[],
      readonly [...Carry, Source[Keys[0] & keyof Source]]
    >
