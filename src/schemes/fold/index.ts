import * as TreeF from '#treeF'
import {cata, cataE, para, struct, zipFolds} from 'effect-ts-folds'
import type {
  TreeEffectFold,
  TreeEffectFolder,
  TreeFold,
  TreeFolder,
  TreeProductFolder,
} from './types.js'

export const treeCata: <A, B>(φ: TreeFolder<A, B>) => TreeFold<A, B> = cata(
  TreeF.Traversable,
)

export const treePara: <A, B>(φ: TreeProductFolder<A, B>) => TreeFold<A, B> =
  para(TreeF.Traversable)

export const treeCataE: <A, B, E = never, R = never>(
  φ: TreeEffectFolder<A, B, E, R>,
) => TreeEffectFold<A, B, E, R> = cataE(TreeF.Traversable)

export const zipTreeFolds = zipFolds(TreeF.Covariant)

export const structTreeFolds = struct(TreeF.Covariant)
