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

/**
 * An unfolder where the types are tupled with some state `FoldState`. A
 * function of the type
 *
 * ```ts
 * StateUnfolder<A, FoldState> = (pair: [Tree<A>, FoldState]) => TreeF<
 *   [A, FoldState],
 *   [Tree<A>, FoldState],
 * >
 * ```
 *
 * Allows you to thread some state through the given tree.
 * @category unfold
 */
export type StateUnfolder<A, FoldState> = TreeUnfold<
  [A, FoldState],
  [Tree<A>, FoldState]
>

/**
 * Just like {@link StateUnfolder} except the type parameter is left open.
 * @category unfold
 * @category unfold
 */
export interface StateUnfolderOf<FoldState> {
  <A>(
    pair: [Tree<A>, FoldState],
  ): TreeF.TreeF<[A, FoldState], [Tree<A>, FoldState]>
}

/**
 * An unfold where the types are tupled with some state `FoldState`. A function
 * of the type
 *
 * ```ts
 * StateUnfold<A, FoldState> = (pair: [Tree<A>, FoldState]) => Tree<[A, FoldState]>
 * ```
 *
 * Allows you to thread some state through the given tree.
 * @category unfold
 */
export type StateUnfold<A, FoldState> = TreeUnfold<
  [A, FoldState],
  [Tree<A>, FoldState]
>

/**
 * Just like {@link StateUnfold} except the type parameter is left open.
 * @category unfold
 */
export interface StateUnfoldOf<FoldState> {
  <A>(pair: [Tree<A>, FoldState]): Tree<[A, FoldState]>
}

/**
 * An unfolder that unfolds `A` into a possibly empty list of `A`.
 * @category unfold
 */
export interface ParentUnfolder<A> {
  (a: A): A[]
}

/**
 * A version of {@link ParentUnfolder} that unfolds into an effect.
 * @category unfold
 */
export interface ParentEffectUnfolder<A, E = unknown, R = unknown> {
  (a: A): Effect.Effect<A[], E, R>
}
