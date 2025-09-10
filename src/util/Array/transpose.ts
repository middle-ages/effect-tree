import {Number, flow, pipe} from 'effect'
import {
  append,
  isNonEmptyArray,
  length,
  map,
  max,
  of,
  reduce,
  replicate,
  zip,
  zipWith,
  type NonEmptyArray,
} from 'effect/Array'
import {none, some, type Option} from 'effect/Option'

/** A 2D readonly non-empty array of `A`. */
export type NonEmptyArray2<A> = NonEmptyArray<NonEmptyArray<A>>

export const _transposeNonEmptyRectangle: NonEmptyArray2Endo = rows => {
  const [head, second, ...tail] = rows
  return second === undefined
    ? pipe(head, map(of))
    : pipe(
        tail,
        reduce(zip(head, second) as typeof rows, (head, second) =>
          zipWith(head, second, (head, second) => append(head, second)),
        ),
      )
}

/** Transpose a possibly empty rectangular 2D array. */
export const transposeRectangle = <A>(rows: NonEmptyArray<A>[]): typeof rows =>
  isNonEmptyArray(rows)
    ? _transposeNonEmptyRectangle(rows)
    : ([] as typeof rows)

/** Transpose a non-empty rectangular 2D array. */
transposeRectangle.nonEmpty = _transposeNonEmptyRectangle

/**
 * Transpose a possibly empty array of non-empty arrays with rows of different
 * lengths.
 */
export const transpose = <A>(
  rows: NonEmptyArray<A>[],
): NonEmptyArray<Option<A>>[] =>
  isNonEmptyArray(rows)
    ? _transposeNonEmpty(rows)
    : ([] as NonEmptyArray<Option<A>>[])

const _transposeNonEmpty: LiftNonEmptyArray2 = ([head, ...tail]) =>
  isNonEmptyArray(tail)
    ? pipe(padSuffixNonEmpty([head, ...tail]), transposeRectangle.nonEmpty)
    : pipe(head, map(flow(some, of)))

/** Transpose a non-empty 2D array with rows of different lengths. */
transpose.nonEmpty = _transposeNonEmpty

// Pad suffix of every row.
const padSuffixNonEmpty: LiftNonEmptyArray2 = xss => {
  const padding = pipe(xss, map(length), max(Number.Order), requiredPadding)
  const f: LiftNonEmptyArray = xs => [...map(xs, some), ...padding([...xs])]
  return pipe(xss, map(f))
}

// Padding required for rows of length `padTo`
const requiredPadding =
  (padTo: number): (<A>(xs: A[]) => Option<A>[]) =>
  xs =>
    padTo === xs.length ? [] : replicate(none(), padTo - xs.length)

interface NonEmptyArray2Endo {
  <A>(xss: NonEmptyArray2<A>): NonEmptyArray2<A>
}

interface LiftNonEmptyArray {
  <A>(xss: NonEmptyArray<A>): NonEmptyArray<Option<A>>
}

export interface LiftNonEmptyArray2 {
  <A>(xss: NonEmptyArray2<A>): NonEmptyArray2<Option<A>>
}
