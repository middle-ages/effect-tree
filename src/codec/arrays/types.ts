import type {Tree, TreeFolder} from '#tree'
import {HKT} from 'effect'

/**
 * The type of trees encoded as nested arrays. In this encoding a leaf is
 * encoded as a single value:
 *
 * ```ts
 * const leaf: TreeArray<number> = 1 // A tree with a single node
 * ```
 *
 * While a branch node is encoded as a pair of `[A, TreeArray<A>[]]`, with the
 * first element being the root node value and the second element being its
 * child nodes encoded as a `TreeArray`. So if we add two children to our leaf
 * it would encode as:
 *
 * ```ts
 * const branch: TreeArray<number> = [1, [2, 3]] // A tree with a 3 nodes
 * ```
 *
 * Adding children to a leaf in this encoding converts it into a pair of
 * `[values, nodes]`. Here is a larger tree encoded as nested arrays:
 *
 * ```ts
 * // ┬1
 * // ├┬2
 * // │├─3
 * // │└─4
 * // ├┬5
 * // │└─6
 * // └─7
 * const tree = make(1, [
 *   make(2, [of(3), of(4)]),
 *   make(5, [of(6)]),
 *   of(7),
 * ])
 *
 * const encoded = codec.array.encode(tree)
 * // [1, [[2, [3, 4]], [5, [6]], 7]]
 * ```
 * @category codec
 */
export type TreeArray<A> = A | [A, TreeArray<A>[]]

/**
 * @category codec
 */
export interface TreeArrayLambda extends HKT.TypeLambda {
  readonly type: TreeArray<this['Target']>
}

/**
 * You cannot encode a tree of arrays as nested arrays because we use
 * `Array.isArray` to discriminate between leaves and branches.
 * @category codec
 */
export type NonArrayType<A> = A extends unknown[]
  ? [never, 'Cannot encode a tree of arrays as an array tree']
  : A extends readonly unknown[]
    ? [never, 'Cannot encode a tree of readonly arrays as an array tree']
    : A

/**
 * An array tree with a non-array type.
 * @category codec
 */
export type ValidArrayTree<A> = Tree<NonArrayType<A>> & Tree<A>

/**
 * Encode a single level of `Tree<A> ⇒ TreeArray<A>`
 * @category codec
 */
export type EncodeFolder<A> = TreeFolder<A, TreeArray<A>>
