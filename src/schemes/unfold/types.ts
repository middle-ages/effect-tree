import * as TreeF from '#treeF'
import {Effect, type HKT} from 'effect'
import type {Tree} from '../../tree/types.js'

/** Also `Coalgebra<TreeFTypeLambda, B, A> */
export type TreeUnfolder<A, B> = (b: B) => TreeF.TreeF<A, B>

export type TreeUnfolderOf<A> = <B>(b: B) => TreeF.TreeF<A, B>

/** Also `EffectCoalgebra<TreeFTypeLambda, B, E, R, A> */
export type TreeEffectUnfolder<A, B, E = unknown, R = unknown> = (
  b: B,
) => Effect.Effect<TreeF.TreeF<A, B>, E, R>

export type TreeEffectUnfolderOf<A, E = unknown, R = unknown> = <B>(
  b: B,
) => Effect.Effect<TreeF.TreeF<A, B>, E, R>

export type TreeUnfold<A, B> = (b: B) => Tree<A>

/** Same type as `EffectUnfold<TreeF.TreeFTypeLambda, B, E, R, A>` */
export type TreeEffectUnfold<A, B, E = unknown, R = unknown> = (
  b: B,
) => Effect.Effect<Tree<A>, E, R>

/** The opposite of {@link TreeFolderK}. */
export interface TreeUnfolderK<F extends HKT.TypeLambda> {
  <A, E = undefined, R = undefined, I = never>(
    fa: HKT.Kind<F, I, R, E, A>,
  ): TreeF.TreeF<A, HKT.Kind<F, I, R, E, A>>
}
