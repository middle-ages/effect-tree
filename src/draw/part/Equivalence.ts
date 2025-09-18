import {constFalse, constTrue, K} from '#util/Function'
import {Effect, Equivalence as EQ, pipe, Predicate} from 'effect'
import {
  equalsFail,
  equalsSuccess,
  getColumnFEqualsE,
  getRowFEqualsE,
} from '../partF.js'
import {
  getText,
  isColumn,
  isEmptyPart,
  isRow,
  isText,
  matchPart,
} from './data.js'
import type {Column, Part, Row} from './types.js'
import {unfixColumn, unfixRow} from './types.js'

/**
 * An `Equivalence` for {@link Part}.
 * @category drawing
 */
export const PartEquivalence: EQ.Equivalence<Part> = (self, that) =>
  pipe(
    EquivalenceE(self, that),
    Effect.match({onFailure: constFalse, onSuccess: constTrue}),
    Effect.runSync,
  )

const EquivalenceE = (self: Part, that: Part): Effect.Effect<void, undefined> =>
  pipe(
    self,
    matchPart(
      pipe(that, fromPredicate(isEmptyPart)),
      show =>
        pipe(
          that,
          fromPredicate(that => isText(that) && show === getText(that)),
        ),
      self => (isRow(that) ? RowEquivalenceE(self, that) : equalsFail),
      self => (isColumn(that) ? ColumnEquivalenceE(self, that) : equalsFail),
    ),
  )

const RowEquivalenceE = (
  selfRow: Row,
  thatRow: Row,
): Effect.Effect<void, undefined> =>
  getRowFEqualsE(EquivalenceE)(unfixRow(selfRow), unfixRow(thatRow))

const ColumnEquivalenceE = (
  selfColumn: Column,
  thatColumn: Column,
): Effect.Effect<void, undefined> =>
  getColumnFEqualsE(EquivalenceE)(
    unfixColumn(selfColumn),
    unfixColumn(thatColumn),
  )

const fromPredicate =
  <A>(predicate: Predicate.Predicate<A>) =>
  (a: A): Effect.Effect<void, undefined> =>
    pipe(
      a,
      predicate,
      Effect.if({onFalse: K(equalsFail), onTrue: K(equalsSuccess)}),
    )
