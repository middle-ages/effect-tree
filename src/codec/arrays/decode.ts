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
 *
 * ```ts
 * import {Codec, drawTree} from 'effect-tree'
 *
 * const tree = Codec.Arrays.decode([
 *   1, [
 *     2, [3, 4, 5],
 *     [6, [
 *       7,
 *       8,
 *       [11, [9]],
 *     ]],
 *     10,
 *   ],
 * ])
 *
 * console.log(drawTree(tree).join('\n'))
 * // prints:
 * // ┬1
 * // ├┬2
 * // │├─3
 * // │├─4
 * // │└─5
 * // ├┬6
 * // │├─7
 * // │├─8
 * // │└┬11
 * // │ └─9
 * // └─10
 * ```ts
 * @category codec
 * @function
 */
export const decode: <A>(ta: TreeArray<A>) => Tree<A> = treeAna(decodeUnfold)
