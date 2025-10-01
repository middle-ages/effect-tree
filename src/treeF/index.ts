import {Pair} from '#util'
import {Array, Function, pipe} from 'effect'
import type {NonEmptyReadonlyArray} from 'effect/Array'
import type {BranchF, LeafF, MatcherF, TreeF} from './types.js'

/**
 * Create a leaf from its value.
 * @example
 * import {TreeF} from 'effect-tree'
 *
 * expect(TreeF.leafF(43)).toEqual({node: 43})
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @category fold
 * @function
 */
export const leafF = <A>(value: A): TreeF<A, any> => ({node: value})

/**
 * Create a branch from its value and a non-empty list of children. This is
 * exactly like {@link TreeF} except the return type is the branch type and
 * you cannot call it with no leaves.
 *
 * Under the key `tupled` you will find a tupled version and under `flipped` a
 * version where the arguments are flipped in order.
 * @example
 * import {TreeF} from 'effect-tree'
 * import {Array} from 'effect'
 * type Branch = TreeF.BranchF<number, number>

 * const leaves: Array.NonEmptyArray<number> = [1, 2, 3]

 * const branch: Branch = TreeF.branchF(42, leaves)
 * const curried: Branch = TreeF.branchF(leaves)(42)
 * const flipped: Branch = TreeF.branchF.flipped(leaves, 42)
 * const flippedC: Branch = TreeF.branchF.flipped(42)(leaves)
 * const tupled: Branch = TreeF.branchF.tupled([42, leaves])

 * expect(branch, 'branch').toEqual({node: 42, forest: leaves})
 * expect(curried, 'curried').toEqual(branch)
 * expect(flipped, 'flipped').toEqual(branch)
 * expect(flippedC, 'flippedC').toEqual(branch)
 * expect(tupled, 'tupled').toEqual(branch)
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @category fold
 * @function
 */
export const branchF: {
  <A, C>(value: A, forest: NonEmptyReadonlyArray<C>): BranchF<A, C>
  <C>(forest: NonEmptyReadonlyArray<C>): <A>(value: A) => BranchF<A, C>
  tupled: <A, C>([node, forest]: [A, Array.NonEmptyArray<C>]) => BranchF<A, C>
  flipped: {
    <A, C>(forest: NonEmptyReadonlyArray<C>, value: A): BranchF<A, C>
    <A>(value: A): <C>(forest: NonEmptyReadonlyArray<C>) => BranchF<A, C>
  }
} = Object.assign(
  Function.dual(
    2,
    <A, C>(value: A, forest: NonEmptyReadonlyArray<C>): TreeF<A, C> => ({
      node: value,
      forest,
    }),
  ),
  {
    /** A flipped version of {@link branchF}. */
    tupled: <A, C>([value, forest]: [A, Array.NonEmptyArray<C>]): BranchF<
      A,
      C
    > => ({node: value, forest}),
    /** A curried version of {@link branchF}. */
    flipped: Function.dual(
      2,
      <A, C>(forest: NonEmptyReadonlyArray<C>, value: A): BranchF<A, C> => ({
        node: value,
        forest,
      }),
    ),
  },
)

/**
 * Create a new `TreeF` from a node value and a possibly empty list of child
 * nodes. See {@link BranchF} for a version of this function specialized for
 * _branches_.
 *
 * Under the key `tupled` you will find a tupled version and under `flipped` a
 * version where the arguments are flipped in order.
 * @example
 * import {TreeF} from 'effect-tree'
 * import {Array} from 'effect'
 *
 * type Tree = TreeF.TreeF<number, number>
 *
 * const leaves: Array.NonEmptyArray<number> = [1, 2, 3]
 *
 * const tree: Tree = TreeF.treeF(42, leaves)
 * const curried: Tree = TreeF.treeF(leaves)(42)
 * const flipped: Tree = TreeF.treeF.flipped(leaves, 42)
 * const flippedC: Tree = TreeF.treeF.flipped(42)(leaves)
 * const tupled: Tree = TreeF.treeF.tupled([42, leaves])
 *
 * expect(tree, 'tree').toEqual({node: 42, forest: leaves})
 * expect(curried, 'curried').toEqual(tree)
 * expect(flipped, 'flipped').toEqual(tree)
 * expect(flippedC, 'flippedC').toEqual(tree)
 * expect(tupled, 'tupled').toEqual(tree)
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @category fold
 * @function
 */
export const treeF: {
  <A, C>(value: A, forest: readonly C[]): TreeF<A, C>
  <C>(forest: readonly C[]): <A>(value: A) => TreeF<A, C>
  flipped: {
    <A, C>(forest: readonly C[], value: A): TreeF<A, C>
    <A>(value: A): <C>(forest: readonly C[]) => TreeF<A, C>
  }
  tupled: <A, C>([value, forest]: [A, Array.NonEmptyArray<C>]) => TreeF<A, C>
} = Object.assign(
  Function.dual(
    2,
    <A, C>(value: A, forest: readonly C[]): TreeF<A, C> =>
      Array.isNonEmptyReadonlyArray(forest)
        ? branchF(value, forest)
        : leafF(value),
  ),
  {
    /** A flipped version of {@link treeF}. */
    flipped: Function.dual(
      2,
      <A, C>(forest: readonly TreeF<A, C>[], value: A): TreeF<A, C> =>
        treeF(value, forest),
    ),
    /** A tupled version of {@link treeF}. */
    tupled: <A, C>([value, forest]: [A, Array.NonEmptyArray<C>]): TreeF<A, C> =>
      treeF(value, forest),
  },
)

/**
 * True if the tree has no children.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @category fold
 * @function
 */
export const isLeaf = <A, C>(self: TreeF<A, C>): self is LeafF<A> =>
  !('forest' in self)

/**
 * True if the tree has child nodes.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @category fold
 * @function
 */
export const isBranch = <A, C>(treeF: TreeF<A, C>): treeF is BranchF<A, C> =>
  !isLeaf(treeF)

/**
 * Match a `TreeF` to leaves and branches.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @typeParam R The result type of the given functions.
 * @category fold
 * @function
 */
export const match =
  <A, C, R>({onLeaf, onBranch}: MatcherF<A, C, R>) =>
  (treeF: TreeF<A, C>): R =>
    isBranch(treeF) ? onBranch(treeF.node, treeF.forest) : onLeaf(treeF.node)

/**
 * Deconstruct a tree into its value and its possible empty forest.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.w$lk
 * @typeParam C The child node type, also called the _carrier type_.
 * @returns A pair of the tree root node value and a possibly empty list of
 * children of the type `C`.
 * @category fold
 * @function
 */
export const destruct = <A, B>(self: TreeF<A, B>): readonly [A, B[]] =>
  pipe(
    self,
    match({
      onLeaf: Pair.pair.withSecond([] as B[]),
      onBranch: (value, forest) => [value, [...forest]] as const,
    }),
  )

/**
 * Compute child count for given tree node.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @returns Numeric length of node forest.
 * @category fold
 * @function
 */
export const length: <A, C>(self: TreeF<A, C>) => number = match({
  onLeaf: () => 0,
  onBranch: (_, forest) => forest.length,
})

/**
 * Get the value of the root tree node.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @returns Root node value.
 * @category fold
 * @function
 */
export const getValue = <A, C>({node}: TreeF<A, C>): A => node

/**
 * Get the value of the root tree forest.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @returns Root node forest.
 * @category fold
 * @function
 */
export const getForest = <A, C>(self: TreeF<A, C>): readonly C[] =>
  isBranch(self) ? self.forest : []

/**
 * Get the non-empty forest of a branch.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam C The child node type, also called the _carrier type_.
 * @returns Branch forest.
 * @category fold
 * @function
 */
export const getBranchForest = <A, C>({
  forest,
}: BranchF<A, C>): Array.NonEmptyReadonlyArray<C> => forest

/**
 * Set the value of a tree node.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam B New underlying type for the tree.
 * @typeParam C The child node type, also called the _carrier type_.
 * @returns A tree with the new value.
 * @category fold
 * @function
 */
export const setValue: {
  <A, B, C>(value: B, self: TreeF<A, C>): TreeF<B, C>
  <A, C>(self: TreeF<A, C>): <B>(value: B) => TreeF<B, C>
} = Function.dual(
  2,
  <A, B, C>(value: B, self: TreeF<A, C>): TreeF<B, C> =>
    pipe(
      self,

      match({
        onLeaf: () => leafF(value),
        onBranch: (_, forest) => branchF(value, forest),
      }),
    ),
)

/**
 * Set the forest of a tree node.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam B New child node type.
 * @typeParam C The child node type, also called the _carrier type_.
 * @returns A tree with the new forest.
 * @category fold
 * @function
 */
export const setForest: {
  <A, B, C>(forest: Array.NonEmptyArray<B>, self: TreeF<A, C>): TreeF<A, B>
  <A, C>(self: TreeF<A, C>): <B>(forest: Array.NonEmptyArray<B>) => TreeF<A, B>
} = Function.dual(
  2,
  <A, B, C>(forest: Array.NonEmptyArray<B>, self: TreeF<A, C>): TreeF<A, B> =>
    pipe(
      self,
      match({
        onLeaf: value => treeF(value, forest),
        onBranch: value => treeF(value, forest),
      }),
    ),
)

/**
 * Map over the tree node value.
 * @typeParam A The underlying type of the tree. For example, in a numeric
 * tree it would be `number`.
 * @typeParam B New child node type and also result type of the given function.
 * @typeParam C The child node type, also called the _carrier type_.
 * @param self the tree node to map over.
 * @param f will be used as the mapping function.
 * @returns A tree with the mapped value.
 * @category fold
 * @function
 */
export const mapValue: {
  <A, B, C>(self: TreeF<A, C>, f: (a: A) => B): TreeF<B, C>
  <A, B>(f: (a: A) => B): <C>(self: TreeF<A, C>) => TreeF<B, C>
} = Function.dual(
  2,
  <A, B, C>(self: TreeF<A, C>, f: (a: A) => B): TreeF<B, C> =>
    pipe(self, getValue, f, setValue(self)),
)
