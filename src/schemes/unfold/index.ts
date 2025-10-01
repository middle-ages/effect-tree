import {applyPair, fanout} from '#Pair'
import * as TreeF from '#treeF'
import {Effect, flow, pipe} from 'effect'
import {ana, anaE} from 'effect-ts-folds'
import type {
  ParentEffectUnfolder,
  ParentUnfolder,
  TreeEffectUnfold,
  TreeEffectUnfolder,
  TreeUnfold,
  TreeUnfolder,
} from './types.js'

/**
 * Unfold a tree.
 * @category unfold
 * @function
 */
export const treeAna: <A, B>(ψ: TreeUnfolder<A, B>) => TreeUnfold<A, B> = ana(
  TreeF.Traversable,
)

/**
 * Unfold a tree into an effect.
 * @category unfold
 * @function
 */
export const treeAnaE = <A, B, E = unknown, R = unknown>(
  ψ: TreeEffectUnfolder<A, B, E, R>,
): TreeEffectUnfold<A, B, E, R> => anaE(TreeF.Traversable)(ψ)

/**
 * The simplest unfold: unfold a tree as long as the given function of type
 * `(parent: A) ⇒ A[]` keeps producing new child nodes.
 * @category unfold
 * @function
 */
export const unfold: <A>(
  unfolder: ParentUnfolder<A>,
) => TreeUnfold<A, A> = unfolder => pipe(unfolder, byParentUnfold, treeAna)

/**
 * A version of {@link unfold} that unfolds into an effect.
 * @category unfold
 * @function
 */
export const unfoldEffect = <A, E = unknown, R = unknown>(
  unfolder: ParentEffectUnfolder<A, E, R>,
) => pipe(unfolder, byParentUnfoldEffect, treeAnaE)

/**
 * Unfold a level of a tree defined by its unfolding function which must decide,
 * given the current node, who are its children? Converts a value of type
 * {@link ParentUnfolder | ParentUnfolder<A>} into a value of type
 * {@link TreeUnfolder | TreeUnfolder<A, A>}.
 *
 * @category unfold
 * @function
 */
export const byParentUnfold = <A>(
  unfolder: ParentUnfolder<A>,
): TreeUnfolder<A, A> =>
  flow(
    fanout(unfolder, TreeF.treeF.flipped<A>),
    applyPair<A[], TreeF.TreeF<A, A>>,
  )

/**
 * A version of {@link byParentUnfold} that unfolds into an effect.
 * Converts a value of type
 * {@link ParentEffectUnfolder | ParentEffectUnfolder<A, E, R>}
 * into a value of type
 * {@link TreeEffectUnfolder | TreeEffectUnfolder<A, A, E, R>}.
 * @category unfold
 * @function
 */
export const byParentUnfoldEffect =
  <A, E = unknown, R = unknown>(
    unfolder: ParentEffectUnfolder<A, E, R>,
  ): TreeEffectUnfolder<A, A, E, R> =>
  a =>
    pipe(a, unfolder, Effect.map(TreeF.treeF.flipped(a)))
