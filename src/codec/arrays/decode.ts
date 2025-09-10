import type {Tree} from '#tree'
import {treeAna} from '#tree'
import * as TreeF from '#treeF'
import {Array} from 'effect'
import type {TreeArray} from './types.js'

export const decodeUnfold = <A>(a: TreeArray<A>): TreeF.TreeF<A> =>
  Array.isArray(a) ? TreeF.treeF(...a) : TreeF.leafF(a)

/** Decode nested arrays into a tree. */
export const decode: <A>(ta: TreeArray<A>) => Tree<A> = treeAna(decodeUnfold)
