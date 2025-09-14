import {Number, pipe} from 'effect'
import {
  append as _append,
  appendAll as _appendAll,
  prepend as _prepend,
  prependAll as _prependAll,
  initNonEmpty,
  lastNonEmpty,
  length,
  map,
  max,
  min,
  type NonEmptyArray,
  type NonEmptyReadonlyArray,
} from 'effect/Array'

export * from 'effect/Array'
export {
  transpose,
  type LiftNonEmptyArray2,
  type NonEmptyArray2,
} from './Array/transpose.js'

/**
 * Insert an element into a sorted numeric list at the correct index so that
 * the lists is still sorted.
 **/
export const insertSorted =
  (sorted: number[]) =>
  (n: number): number[] => {
    let [l, h] = [0, sorted.length]
    while (l < h) {
      const m = (l + h) >>> 1
      const s = sorted[m]
      if (s === undefined) throw new Error('Input array is not sorted')
      if (s < n) l = m + 1
      else h = m
    }

    return [...sorted.slice(0, l), n, ...sorted.slice(l)]
  }

export const append = Object.assign(_append, {
  flip:
    <A>(self: A[]): ((last: A) => A[]) =>
    last =>
      _append(self, last),
})

export const prepend = Object.assign(_prepend, {
  flip:
    <A>(self: A[]): ((last: A) => A[]) =>
    head =>
      _prepend(self, head),
})

export const appendAll = Object.assign(_appendAll, {
  flip:
    <A>(self: A[]): ((tail: A[]) => A[]) =>
    tail =>
      _appendAll(self, tail),
})

export const prependAll = Object.assign(_prependAll, {
  flip:
    <A>(self: A[]): ((head: A[]) => A[]) =>
    init =>
      _prependAll(self, init),
})

export const lastInit = <A>(xs: NonEmptyReadonlyArray<A>): [A, A[]] => [
  lastNonEmpty(xs),
  initNonEmpty(xs),
]

export const headTail = <A>([head, ...tail]: NonEmptyReadonlyArray<A>): [
  A,
  A[],
] => [head, tail]

export const surroundArray =
  <A>([prefix, suffix]: [A[], A[]]): ((xs: A[]) => A[]) =>
  xs => [...prefix, ...xs, ...suffix]

export function mapHeadTail<A, B>(onHead: (a: A) => B, onTail: (a: A) => B) {
  return (xs: NonEmptyReadonlyArray<A>): NonEmptyArray<B> => {
    const [head, tail] = headTail(xs)
    return [onHead(head), ...pipe(tail, map(onTail))]
  }
}
/**
 ▏* Map over an array with one function for the last element and another
 ▏* for the rest.
 ▏*/
export function mapInitLast<A, B>(onInit: (a: A) => B, onLast: (a: A) => B) {
  return (xs: NonEmptyReadonlyArray<A>): NonEmptyArray<B> => {
    const [last, init] = lastInit(xs)
    return pipe(init, map(onInit), _append(onLast(last)))
  }
}

/** Get the length of the longest child in a list of lists. */
export const longestChildLength: (
  xs: NonEmptyArray<unknown[]>,
) => number = children =>
  max(Number.Order)([
    0,
    ...pipe(
      children,
      map(xs => length(xs)),
    ),
  ])

/** Get the length of the shortest child in a list of lists. */
export const shortestChildLength: (
  xs: NonEmptyArray<unknown[]>,
) => number = children =>
  pipe(
    children,
    map(xs => length(xs)),
    min(Number.Order),
  )
