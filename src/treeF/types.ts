import {Array, HKT} from 'effect'

/**
 * The non-recursive tree type where the child type is left as open. Used by the
 * recursion schemes. A tree is either a leaf or a branch.
 * @typeParam A - The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C - The child node type, also called the _carrier type_.
 * @category folds
 */
export type TreeF<A, C = unknown> = LeafF<A> | BranchF<A, C>

/**
 * A tree with no nodes.
 * @typeParam A - The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @category folds
 */
export interface LeafF<A> {
  node: A
}

/**
 * A tree with non-empty list of child nodes.
 * @typeParam A - The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C - The child node type, also called the _carrier type_.
 * @category folds
 */
export interface BranchF<A, C> extends LeafF<A> {
  forest: Array.NonEmptyReadonlyArray<C>
}

export interface MatcherF<A, C, R> {
  onLeaf: (node: A) => R
  onBranch: (node: A, forest: Array.NonEmptyReadonlyArray<C>) => R
}

/**
 * Type lambda for the `TreeF<A, C>` type.
 * `Kind<TreeFTypeLambda, never, unknown, A, C> = TreeF<A, C>`
 * @category folds
 */
export interface TreeFTypeLambda extends HKT.TypeLambda {
  readonly type: TreeF<this['Out1'], this['Target']>
}
