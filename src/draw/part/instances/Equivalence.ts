import {Array, Effect, pipe, Predicate, type Equivalence as EQ} from 'effect'
import {constFalse, constTrue, tupled} from 'effect/Function'
import {
  getText,
  isColumn,
  isEmptyPart,
  isRow,
  isText,
  matchPart,
  unfixColumn,
  unfixRow,
} from '../data.js'
import {BasePartFEquals, BaseRowFEquals} from '../partF.js'
import type {Column, Part, Row} from '../types.js'

/** An {@link Equivalence} for {@link Part}. */
export const Equivalence: EQ.Equivalence<Part> = (self, that) =>
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
      self => (isRow(that) ? RowEquivalenceE(self, that) : fail()),
      self => (isColumn(that) ? ColumnEquivalenceE(self, that) : fail()),
    ),
  )

const RowEquivalenceE = (
  self: Row,
  that: Row,
): Effect.Effect<void, undefined> =>
  BaseRowFEquals(unfixRow(self), unfixRow(that))
    ? CellEquivalenceE(self, that)
    : fail()

const ColumnEquivalenceE = (
  self: Column,
  that: Column,
): Effect.Effect<void, undefined> =>
  BasePartFEquals(unfixColumn(self), unfixColumn(that))
    ? CellEquivalenceE(self, that)
    : fail()

const CellEquivalenceE = (
  {unfixed: {cells: self}}: {unfixed: {cells: Part[]}},
  {unfixed: {cells: that}}: {unfixed: {cells: Part[]}},
): Effect.Effect<void, undefined> =>
  self.length === that.length
    ? Effect.suspend(() =>
        pipe(Array.zip(self, that), Effect.forEach(tupled(EquivalenceE))),
      )
    : fail()

const [succeed, fail] = [() => Effect.succeed({}), () => Effect.fail(void {})]

const fromPredicate =
  <A>(predicate: Predicate.Predicate<A>) =>
  (a: A) =>
    pipe(a, predicate, Effect.if({onFalse: fail, onTrue: succeed}))
