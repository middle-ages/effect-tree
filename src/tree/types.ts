/**
 * Tree types.
 * @packageDocumentation
 */
import type {BranchF, LeafF, TreeFTypeLambda} from '#treeF'
import {HKT} from 'effect'
import {type Fix, type Unfixed} from 'effect-ts-folds'
import {type NonEmptyReadonlyArray} from 'effect/Array'

/** Astrict Rose tree with nodes carrying a value of type `A`. */
export type Tree<A> = Fix<TreeFTypeLambda, A>

/** The leaf type of {@link Tree}. */
export type Leaf<A> = Record<'unfixed', LeafF<A>>

/** The branch type of {@link Tree}. */
export type Branch<A> = Record<'unfixed', BranchF<A, Tree<A>>>

export interface Matcher<A, R> {
  onLeaf: (node: A) => R
  onBranch: (node: A, forest: ForestOf<A>) => R
}

/** The unfixed `TreeF<A, Tree<A>>` version of {@link Tree}. */
export type UnfixedTree<A> = Unfixed<TreeFTypeLambda, A>

/** Type lambda for the `Tree<A>` type. */
export interface TreeTypeLambda extends HKT.TypeLambda {
  readonly type: Tree<this['Target']>
}

/** A non-empty list of trees. */
export type ForestOf<A> = NonEmptyReadonlyArray<Tree<A>>
