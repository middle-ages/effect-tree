import {Predicate, Record, pipe} from 'effect'

export * from 'effect/Record'

/** A curried version of `Record.singleton` */
export const withKey =
  <const K extends string>(k: K) =>
  <const V>(v: V) =>
    ({[k]: v}) as Record<K, V>

/** Pluck the value associated with a key from a record. */
export const pluck =
  <const K extends string>(key: K) =>
  <T extends {[L in K]: T[L]}>(o: T): T[K] =>
    o[key]

/** Filter record entries so that only defined entries remain. */
export const filterDefined = <const Key extends PropertyKey, Value extends {}>(
  record: Partial<Record<Key, Value | undefined>>,
) =>
  pipe(record, Record.filter(Predicate.isNotUndefined)) as Partial<
    Record<Key, Value>
  >

/**
 * Merge `self` with `that`. `that` entries will override `self` entries with
 * the same key.
 */
export const mergeWith =
  <That extends {}>(that: That) =>
  <Self extends {}>(self: Self): Self & That => ({
    ...self,
    ...that,
  })

mergeWith.tupled = <That extends {}, Self extends {}>([that, self]: [
  Self,
  That,
]): Self & That => mergeWith(that)(self)

/**
 * The object with the keys `keys` and all its values set to `value`
 */
export const monoRecord =
  <const V>(value: V) =>
  <const KS extends readonly [string, ...string[]]>(
    ...keys: KS
  ): Record<KS[number], V> => {
    const result = {} as Record<KS[number], V>
    for (const key of keys) {
      result[key as KS[number]] = value
    }
    return result
  }
