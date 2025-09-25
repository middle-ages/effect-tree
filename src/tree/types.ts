import type {BranchF, LeafF, TreeFTypeLambda} from '#treeF'
import {HKT} from 'effect'
import {type Fix} from 'effect-ts-folds'
import {type NonEmptyReadonlyArray} from 'effect/Array'

/**
 * A strict Rose tree with nodes carrying a value of type `A`. See the
 * {@link TreeF} type for the _unfixed_ version, where
 * `Tree<A>.unfixed ≡ TreeF<A, Tree<A>>`.
 *
 * The fully expanded version of the type of a _branch_ would look like:
 *
 * ```ts
 * Tree<A> = {
 *   unfixed: {
 *     node: A
 *     forest: NonEmptyArray<Tree<A>>
 *   }
 * }
 * ```
 * @typeParam A - Underlying tree type.
 * @category basic
 */
export type Tree<A> = Fix<TreeFTypeLambda, A>

/**
 * The leaf type of {@link Tree}. Leaves are simple wrappers over
 * {@link LeafF} values.
 * @typeParam A - Underlying tree type.
 * @category basic
 */
export type Leaf<A> = Record<'unfixed', LeafF<A>>

/**
 * The branch type of {@link Tree}. Branches are simple wrappers over
 * {@link BranchF} values.
 * @typeParam A - Underlying tree type.
 * @category basic
 */
export type Branch<A> = Record<'unfixed', BranchF<A, Tree<A>>>

/**
 * @category basic
 */
export interface Matcher<A, R> {
  onLeaf: (node: A) => R
  onBranch: (node: A, forest: ForestOf<A>) => R
}

/**
 * Type lambda for the `Tree<A>` type.
 *
 * ```txt
 * Kind<TreeTypeLambda, unknown, unknown, unknown, A> ≡ TreeF<A, Tree<A>>
 * ```
 * @category basic
 */
export interface TreeTypeLambda extends HKT.TypeLambda {
  readonly type: Tree<this['Target']>
}

/**
 * A non-empty list of trees.
 * @typeParam A - Underlying tree type.
 * @category basic
 */
export type ForestOf<A> = NonEmptyReadonlyArray<Tree<A>>
