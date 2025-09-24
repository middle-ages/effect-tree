import * as TreeF from '#treeF'
import {cata, cataE, para, struct, zipFolds} from 'effect-ts-folds'
import type {
  TreeEffectFold,
  TreeEffectFolder,
  TreeFold,
  TreeFolder,
  TreeProductFolder,
} from './types.js'

/**
 * Run a {@link TreeFolder}<A, B> on a {@link Tree}<A> to fold into a value of
 * type `B`.
 * @category fold
 * @function
 */
export const treeCata: <A, B>(φ: TreeFolder<A, B>) => TreeFold<A, B> = cata(
  TreeF.Traversable,
)

/**
 * Run a {@link TreeProductFolder}<A, B> on a {@link Tree}<A> to fold into a value of
 * type `B`. Just like {@link treeCata} except the folder function
 * gets all previous computed values.
 * @category fold
 * @function
 */
export const treePara: <A, B>(φ: TreeProductFolder<A, B>) => TreeFold<A, B> =
  para(TreeF.Traversable)

/**
 * Just like {@link treeCata}, except the folder is _effectful_.
 * @category fold
 * @function
 */
export const treeCataEffect: <A, B, E = never, R = never>(
  φ: TreeEffectFolder<A, B, E, R>,
) => TreeEffectFold<A, B, E, R> = cataE(TreeF.Traversable)

/**
 * Zip a pair of folds to create a single fold. It will fold into a pair of the
 * result of the zipped folds.
 * @category fold
 * @function
 */
export const zipTreeFolds = zipFolds(TreeF.Covariant)

/**
 * Create a fold that folds into a struct from a struct of folds.
 * @category fold
 * @function
 */
export const structTreeFolds = struct(TreeF.Covariant)
