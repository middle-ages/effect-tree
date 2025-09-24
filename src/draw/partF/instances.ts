import {
  Applicative,
  Covariant as CO,
  Traversable as TA,
} from '@effect/typeclass'
import {Traversable as ArrayTraversable} from '@effect/typeclass/data/Array'
import {Array, flow, Function, HKT, pipe} from 'effect'
import {emptyF, textF} from './data.js'
import {
  ColumnF,
  matchPartF,
  RowF,
  type PartF,
  type PartFTypeLambda,
} from './types.js'

/**
 * @category drawing
 * @function
 */
export const map: CO.Covariant<PartFTypeLambda>['map'] = Function.dual(
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

/**
 * `Covariant` instance for {@link PartF}.
 * @category drawing
 * @function
 */
export const imap = CO.imap<PartFTypeLambda>(map)

/**
 * `Covariant` instance for {@link PartF}.
 * @category drawing
 * @function
 */
export const traverse: TA.Traversable<PartFTypeLambda>['traverse'] = <
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
 * @category instances
 */
export const Covariant: CO.Covariant<PartFTypeLambda> = {map, imap}

/**
 * `Traversable` instance for {@link PartF}.
 * @category drawing
 * @category instances
 */
export const Traversable: TA.Traversable<PartFTypeLambda> = {traverse}

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
