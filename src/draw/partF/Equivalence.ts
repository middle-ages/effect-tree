import {tupled} from '#Function'
import {Effect, Equivalence as EQ, pipe} from 'effect'
import {getEquivalence as getArrayEquivalence, zip} from 'effect/Array'
import {AlignedEquivalence, HorizontalEquivalence} from '../align.js'
import {
  ColumnF,
  isColumnF,
  isEmptyF,
  isRowF,
  isTextF,
  matchPartF,
  RowF,
  type PartF,
} from './types.js'

/**
 * Build an
 * [Equivalence](https://effect-ts.github.io/effect/effect/Equivalence.ts.html)
 * for a {@link PartF} from an equivalence of its underlying type.
 * @category drawing
 * @category instances
 * @function
 */
export const getEquivalence =
  <A>(equalsA: EQ.Equivalence<A>): EQ.Equivalence<PartF<A>> =>
  (self: PartF<A>, that: PartF<A>) =>
    pipe(
      self,
      matchPartF<A, boolean>(
        isEmptyF(that),
        show => isTextF(that) && that.show === show,
        self => isRowF(that) && getRowFEquals(equalsA)(self, that),
        self => isColumnF(that) && getColumnFEquals(equalsA)(self, that),
      ),
    )

const getRowFEquals =
  <A>(equalsA: EQ.Equivalence<A>): EQ.Equivalence<RowF<A>> =>
  ({cells: selfCells, ...self}, {cells: thatCells, ...that}) =>
    AlignedEquivalence(self, that) &&
    getArrayEquivalence(equalsA)(selfCells, thatCells)

const getColumnFEquals =
  <A>(equalsA: EQ.Equivalence<A>): EQ.Equivalence<ColumnF<A>> =>
  ({cells: selfCells, ...self}, {cells: thatCells, ...that}) =>
    HorizontalEquivalence(self, that) &&
    getArrayEquivalence(equalsA)(selfCells, thatCells)

/**
 * @category internal
 * @function
 */
export const getRowFEqualsE =
  <A>(
    equalsA: (self: A, that: A) => Effect.Effect<void, undefined>,
  ): ((self: RowF<A>, that: RowF<A>) => Effect.Effect<void, undefined>) =>
  ({cells: selfCells, ...self}, {cells: thatCells, ...that}) =>
    AlignedEquivalence(self, that)
      ? pipe(selfCells, zip(thatCells), Effect.forEach(tupled(equalsA)))
      : Effect.fail(void {})

/**
 * @category internal
 * @function
 */
export const getColumnFEqualsE =
  <A>(
    equalsA: (self: A, that: A) => Effect.Effect<void, undefined>,
  ): ((self: ColumnF<A>, that: ColumnF<A>) => Effect.Effect<void, undefined>) =>
  ({cells: selfCells, ...self}, {cells: thatCells, ...that}) =>
    HorizontalEquivalence(self, that)
      ? pipe(selfCells, zip(thatCells), Effect.forEach(tupled(equalsA)))
      : equalsFail

/**
 * @category internal
 */
export const equalsSuccess: Effect.Effect<void, undefined> = Effect.succeed({})

/**
 * @category internal
 */
export const equalsFail: Effect.Effect<void, undefined> = Effect.fail(void {})
