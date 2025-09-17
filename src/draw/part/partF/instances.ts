import {
  Applicative,
  Covariant as CO,
  Traversable as TA,
} from '@effect/typeclass'
import {Traversable as ArrayTraversable} from '@effect/typeclass/data/Array'
import {Array, Equivalence as EQ, flow, Function, HKT, pipe} from 'effect'
import {getEquivalence as getArrayEquivalence} from 'effect/Array'
import {type HorizontalAlignment} from '../align/data.js'
import {
  ColumnF,
  emptyF,
  isColumnF,
  isEmptyF,
  isRowF,
  isTextF,
  matchPartF,
  RowF,
  textF,
  type PartF,
  type PartFTypeLambda,
  type Text,
} from './data.js'

const map: CO.Covariant<PartFTypeLambda>['map'] = Function.dual(
  2,
  <A, B>(fa: PartF<A>, f: (a: A) => B) =>
    pipe(
      fa,
      matchPartF<A, PartF<B>>(
        emptyF,
        show => textF(show),
        ({cells, ...rest}): RowF<B> =>
          RowF({
            ...rest,
            cells: pipe(cells, Array.map(f)),
          }),
        ({cells, ...rest}): ColumnF<B> =>
          ColumnF({
            ...rest,
            cells: pipe(cells, Array.map(f)),
          }),
      ),
    ),
)

const imap = CO.imap<PartFTypeLambda>(map)

const traverse: TA.Traversable<PartFTypeLambda>['traverse'] = <
  F extends HKT.TypeLambda,
>(
  F: Applicative.Applicative<F>,
) =>
  Function.dual(
    2,
    <A, B>(
      tfa: PartF<A>,
      f: (a: A) => HKT.Kind<F, unknown, unknown, never, B>,
    ) => pipe(tfa, map(f), sequenceParts(F)),
  )

/**
 * `Covariant` instance for {@link PartF}.
 * @category drawing
 */
export const Covariant: CO.Covariant<PartFTypeLambda> = {map, imap}

/**
 * `Traversable` instance for {@link PartF}.
 * @category drawing
 */
export const Traversable: TA.Traversable<PartFTypeLambda> = {traverse}

/**
 * Build an
 * [Equivalence](https://effect-ts.github.io/effect/effect/Equivalence.ts.html)
 * for a {@link PartF} from an equivalence of its underlying type.
 * @category drawing
 */
export const getEquivalence = <A>(
  equalsA: EQ.Equivalence<A>,
): EQ.Equivalence<PartF<A>> => {
  const [RowEquals, ColumnEquals] = [
    getRowFEquals(equalsA),
    getColumnFEquals(equalsA),
  ]

  return (self: PartF<A>, that: PartF<A>) =>
    pipe(
      self,
      matchPartF<A, boolean>(
        isEmptyF(that),
        show => isTextF(that) && that.show === show,
        self => isRowF(that) && RowEquals(self, that),
        self => isColumnF(that) && ColumnEquals(self, that),
      ),
    )
}

const getRowFEquals =
    <A>(equalsA: EQ.Equivalence<A>): EQ.Equivalence<RowF<A>> =>
    (self, that) =>
      BaseRowFEquals(self, that) &&
      getArrayEquivalence(equalsA)(self.cells, that.cells),
  getColumnFEquals =
    <A>(equalsA: EQ.Equivalence<A>): EQ.Equivalence<ColumnF<A>> =>
    (self, that) =>
      BasePartFEquals(self, that) &&
      getArrayEquivalence(equalsA)(self.cells, that.cells)

const TextPartEquivalence: EQ.Equivalence<Text> = (self, that) =>
  self.unfixed.show === that.unfixed.show

/**
 * @category drawing
 */
export const BasePartFEquals = (
  self: {hAlign: HorizontalAlignment; hStrut: Text},
  that: typeof self,
): boolean =>
  self.hAlign === that.hAlign && TextPartEquivalence(self.hStrut, that.hStrut)

/**
 * @category drawing
 */
export const BaseRowFEquals = (
  self: RowF<unknown>,
  that: RowF<unknown>,
): boolean =>
  BasePartFEquals(self, that) &&
  self.vAlign === that.vAlign &&
  getArrayEquivalence(TextPartEquivalence)(self.vStrut, that.vStrut)

const sequenceParts =
  <F extends HKT.TypeLambda>(F: Applicative.Applicative<F>) =>
  <A>(
    partF: PartF<HKT.Kind<F, unknown, unknown, never, A>>,
  ): HKT.Kind<F, unknown, unknown, never, PartF<A>> => {
    type Fa = HKT.Kind<F, unknown, unknown, never, A>
    type FPa = HKT.Kind<F, unknown, unknown, never, PartF<A>>

    const traverse = TA.sequence(ArrayTraversable)(F)
    const map = F.map<readonly A[], PartF<A>>

    return pipe(
      partF,
      matchPartF(
        F.of<PartF<A>>(emptyF),
        flow(textF, F.of<PartF<A>>),
        ({cells, ...rest}: RowF<Fa>): FPa =>
          pipe(
            cells,
            traverse,
            map(cells => RowF({...rest, cells: [...cells]})),
          ),
        ({cells, ...rest}: ColumnF<Fa>): FPa =>
          pipe(
            cells,
            traverse,
            map(cells => ColumnF({...rest, cells: [...cells]})),
          ),
      ),
    )
  }
