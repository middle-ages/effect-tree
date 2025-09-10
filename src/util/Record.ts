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
