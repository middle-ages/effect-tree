import * as TreeF from '#treeF'
import {applyPair, fanout} from '#util/Pair'
import {flow, pipe} from 'effect'
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

/**
 * The simplest unfold: unfold a tree as long as the given function of type
 * `(parent: A) ⇒ A[]` keeps producing new child nodes.
 */
export const unfold: <A>(
  unfolder: (parent: A) => A[],
) => TreeUnfold<A, A> = unfolder => pipe(unfolder, byParentUnfold, treeAna)

/**
 * Unfold a level of a tree defined by its unfolding function which must decide,
 * given the current node, who are its children?
 */
export const byParentUnfold = <A>(
  unfolder: (parent: A) => A[],
): TreeUnfolder<A, A> =>
  flow(fanout(unfolder, TreeF.treeF.flip<A>), applyPair<A[], TreeF.TreeF<A, A>>)
