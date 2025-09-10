import * as TreeF from '#treeF'
import {Effect, type HKT} from 'effect'
import {type Algebra, type RAlgebra} from 'effect-ts-folds'
import {type Tree} from '../../tree/types.js'

/**
 * Type of a function that folds a single level of the tree.
 * Same type as: `(self: TreeF.TreeF<A, B>) => B`.
 */
export type TreeFolder<A, B> = Algebra<TreeF.TreeFTypeLambda, B, A>

/**
 * Also: `Folder<TreeF.TreeFTypeLambda, IdentityTypeLambda, B>`.
 * Same as {@link TreeFolder} except the type parameter `B` is given.
 */
export interface TreeFolderOf<B> {
  <A>(self: TreeF.TreeF<A, B>): B
}

/**
 * Just like {@link TreeFolder} except it folds into an effect.
 * Same type as `EffectAlgebra<TreeFTypeLambda, B, E, R, A>.
 */
export type TreeEffectFolder<A, B, E = never, R = never> = (
  self: TreeF.TreeF<A, B>,
) => Effect.Effect<B, E, R>

/** A version of {@link TreeEffectFolder} where the node type is open. */
export interface TreeEffectFolderOf<B, E = never, R = never> {
  <A>(self: TreeF.TreeF<A, B>): Effect.Effect<B, E, R>
}

/** The result type of all folds. */
export type TreeFold<A, B> = (self: Tree<A>) => B

/** Same as {@link TreeFold} except the `A` type parameter is open. */
export type TreeFoldOf<B> = <A>(self: Tree<A>) => B

/** The result type of all effectful folds. */
export type TreeEffectFold<A, B, E = never, R = never> = (
  self: Tree<A>,
) => Effect.Effect<B, E, R>

/**
 * A tree folder for a type of kind `* → *`, where the type parameter
 * is inferred. The type lambda `F` will be used to build the actual
 * folder type.
 *
 * For example consider the function `MyFolder` which happens to be a tree
 * folder with a carrier type of `Option<A>`:
 *
 *
 * ```ts
 * type MyFolder = <A>(treeF: TreeF<Option<A>>) => Option<A>
 * ```
 *
 * Its type can be written using `TreeAlgebraK` without mentioning the free
 * parameter `A`:
 *
 *
 * ```ts
 * type MyFolder = TreeFolderK<OptionTypeLambda>
 * ```
 */
export interface TreeFolderK<F extends HKT.TypeLambda> {
  <A, E = undefined, R = undefined, I = never>(
    t: TreeF.TreeF<A, HKT.Kind<F, E, R, I, A>>,
  ): HKT.Kind<F, E, R, I, A>
}

/** The type of the function `(self: TreeF.TreeF<B, [Tree<T>, A]>) => A`. */
export type TreeProductFolder<A, B> = RAlgebra<TreeF.TreeFTypeLambda, B, A>

/** Same `TreeFolderK` but for `RAlgebra`s. */
export interface TreeProductFolderK<F extends HKT.TypeLambda> {
  <A, E = unknown, R = unknown, I = never>(
    t: TreeF.TreeF<A, [Tree<A>, HKT.Kind<F, I, R, E, A>]>,
  ): HKT.Kind<F, I, R, E, A>
}
