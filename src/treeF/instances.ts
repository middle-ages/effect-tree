import {
  Applicative as AP,
  Covariant as CO,
  FlatMap as FL,
  SemiApplicative as SE,
  Traversable as TA,
} from '@effect/typeclass'
import {Traversable as ArrayTraversable} from '@effect/typeclass/data/Array'
import {Array, Equivalence, flow, Function, HKT, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {branchF, leafF, match, treeF} from './index.js'
import type {TreeF, TreeFTypeLambda} from './types.js'

export const map: CO.Covariant<TreeFTypeLambda>['map'] = Function.dual(
  2,
  <A, C, D>(self: TreeF<A, C>, f: (c: C) => D): TreeF<A, D> =>
    pipe(
      self,
      match({
        onLeaf: leafF,
        onBranch: (node, forest) => ({node, forest: Array.map(forest, f)}),
      }),
    ),
)

export const imap = CO.imap<TreeFTypeLambda>(map)

export const flatMap: FL.FlatMap<TreeFTypeLambda>['flatMap'] = Function.dual(
  2,
  <_R2, _O2, A, C, _R1, _O1, _E1, D>(
    self: TreeF<A, C>,
    f: (c: C) => TreeF<A, D>,
  ): TreeF<A, D> =>
    pipe(self, map(f), match({onLeaf: leafF<A>, onBranch: branchF})),
)

export const traverse: TA.Traversable<TreeFTypeLambda>['traverse'] = <
  F extends HKT.TypeLambda,
>(
  F: AP.Applicative<F>,
) =>
  Function.dual(
    2,
    <_R, _O, A, C, R, O, E, D>(
      self: TreeF<A, C>,
      f: (a: C) => HKT.Kind<F, R, O, E, D>,
    ): HKT.Kind<F, R, O, E, TreeF<A, D>> =>
      pipe(
        self,
        match({
          onLeaf: flow(leafF, F.of),
          onBranch: (node, forest) => treeFK(F)(node, Array.map(forest, f)),
        }),
      ),
  )

/**
 * Covariant instance for {@link TreeF}.
 * @category instances
 */
export const Covariant: CO.Covariant<TreeFTypeLambda> = {map, imap}

/**
 * FlatMap instance for {@link TreeF}.
 * @category instances
 */
export const FlatMap: FL.FlatMap<TreeFTypeLambda> = {flatMap}

/**
 * Traversable instance for {@link TreeF}.
 * @category instances
 */
export const Traversable: TA.Traversable<TreeFTypeLambda> = {traverse}

/**
 * Build an equivalence for {@link TreeF} from an equivalence of the tree type
 * and an equivalence of the carrier type.
 *
 * @category instances
 */
export const getEquivalence =
  <A>(equalsA: Equivalence.Equivalence<A>) =>
  <C>(
    equalsC: Equivalence.Equivalence<C>,
  ): Equivalence.Equivalence<TreeF<A, C>> =>
  (self, that) =>
    pipe(
      self,
      match({
        onLeaf: selfNode =>
          pipe(
            that,
            match({
              onLeaf: thatNode => equalsA(selfNode, thatNode),
              onBranch: Function.constFalse,
            }),
          ),
        onBranch: (selfNode, selfForest) =>
          pipe(
            that,
            match({
              onLeaf: Function.constFalse,
              onBranch: (thatNode, thatForest) =>
                selfNode === thatNode &&
                Array.getEquivalence(equalsC)(selfForest, thatForest),
            }),
          ),
      }),
    )

const treeFK =
  <F extends HKT.TypeLambda>(F: AP.Applicative<F>) =>
  <A, C, E = unknown, O = unknown, R = never>(
    node: A,
    forest: NonEmptyArray<HKT.Kind<F, R, O, E, C>>,
  ): HKT.Kind<F, R, O, E, TreeF<A, C>> =>
    pipe(
      node,
      F.of,
      SE.lift2(F)(treeF<A, C>)(TA.sequence(ArrayTraversable)(F)(forest)),
    )
