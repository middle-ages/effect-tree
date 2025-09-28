import type {Tree} from '#tree'
import {treeAna} from '#tree'
import * as TreeF from '#treeF'
import {Array} from 'effect'
import type {TreeArray} from './types.js'

/**
 * Decode a single level of the encoding.
 * @category unfold
 * @category codec
 * @function
 */
export const decodeUnfold = <A>(a: TreeArray<A>): TreeF.TreeF<A> =>
  Array.isArray(a) ? TreeF.treeF(...a) : TreeF.leafF(a)

/**
 * Decode nested arrays into a tree.
 * @example
 * import {Codec, drawTree} from 'effect-tree'
 *
 * const tree = Codec.Arrays.decode([
 *   1, [2, [3, [4, 5]], [6, [7, 8]]],
 * ])
 *
 * expect(drawTree.number(tree)).toEqual([
 *   '┬1  ',
 *   '├─2 ',
 *   '├┬3 ',
 *   '│├─4',
 *   '│└─5',
 *   '└┬6 ',
 *   ' ├─7',
 *   ' └─8',
 * ])
 * @category codec
 * @function
 */
export const decode: <A>(ta: TreeArray<A>) => Tree<A> = treeAna(decodeUnfold)
