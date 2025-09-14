import * as TreeF from '#treeF'
import {Effect, type HKT} from 'effect'
import type {Tree} from '../../tree/types.js'

/**
 * Type of a function that unfolds a single value of type `B` into a
 * non-recursive tree with a node of type `A` and a forest of type `B`.
 *
 * Same type as [Coalgebra](https://github.com/middle-ages/effect-ts-folds/blob/main/src/unfold/unfolds.ts#L26).
 * @category unfold
 */
export type TreeUnfolder<A, B> = (b: B) => TreeF.TreeF<A, B>

/**
 * Same as {@link TreeUnfolder} except the `B` type parameter is left open.
 * @category unfold
 */
export type TreeUnfolderOf<A> = <B>(b: B) => TreeF.TreeF<A, B>

/**
 * Same as {@link TreeUnfolder} except the unfolding function is into an
 * `Effect`.
 *
 * Same type as `EffectCoalgebra<TreeFTypeLambda, B, E, R, A>.
 * @category unfold
 */
export type TreeEffectUnfolder<A, B, E = unknown, R = unknown> = (
  b: B,
) => Effect.Effect<TreeF.TreeF<A, B>, E, R>

/**
 * The result type of all unfolding schemes.
 * @category unfold
 */
export type TreeUnfold<A, B> = (b: B) => Tree<A>

/**
 * Same type as `EffectUnfold<TreeF.TreeFTypeLambda, B, E, R, A>`.
 * @category unfold
 */
export type TreeEffectUnfold<A, B, E = unknown, R = unknown> = (
  b: B,
) => Effect.Effect<Tree<A>, E, R>

/**
 * The opposite of {@link TreeFolderK}.
 * @category unfold
 */
export interface TreeUnfolderK<F extends HKT.TypeLambda> {
  <A, E = undefined, R = undefined, I = never>(
    fa: HKT.Kind<F, I, R, E, A>,
  ): TreeF.TreeF<A, HKT.Kind<F, I, R, E, A>>
}
