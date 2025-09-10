import * as TreeF from '#treeF'
import {applyPair, fanout} from '#util/Pair'
import {Effect, flow, pipe} from 'effect'
import {ana, anaE} from 'effect-ts-folds'
import type {
  TreeEffectUnfold,
  TreeEffectUnfolder,
  TreeUnfold,
  TreeUnfolder,
} from './types.js'

/** Unfold a tree. */
export const treeAna: <A, B>(ψ: TreeUnfolder<A, B>) => TreeUnfold<A, B> = ana(
  TreeF.Traversable,
)

/** Unfold a tree into an effect. */
export const treeAnaE = <A, B, E = unknown, R = unknown>(
  ψ: TreeEffectUnfolder<A, B, E, R>,
): TreeEffectUnfold<A, B, E, R> => anaE(TreeF.Traversable)(ψ)

export const unfold: <A>(
  unfolder: (parent: A) => A[],
) => TreeUnfold<A, A> = unfolder => pipe(unfolder, byParentUnfold, treeAna)

export const unfoldEffect = <A, E, R>(
  unfolder: (parent: A) => Effect.Effect<A[], E, R>,
): TreeEffectUnfold<A, A, E, R> =>
  pipe(unfolder, byParentEffectUnfold, treeAnaE)

/**
 * Unfold a level of a tree defined by its unfolding function which must decide,
 * given the current node, who are its children?
 */
export const byParentUnfold = <A>(
  unfolder: (parent: A) => A[],
): TreeUnfolder<A, A> =>
  flow(fanout(unfolder, TreeF.withForest<A>), applyPair<A[], TreeF.TreeF<A, A>>)

/**
 * Unfold a level of a tree defined by its unfolding function which must decide,
 * given the current node, who are its children? This is a version of {@link unfolder}
 * where the given unfolder functions folds into an effect.
 */
export const byParentEffectUnfold =
  <A, E, R>(
    unfolder: (parent: A) => Effect.Effect<A[], E, R>,
  ): TreeEffectUnfolder<A, A, E, R> =>
  a =>
    pipe(a, unfolder, Effect.map(TreeF.withForest(a)))
