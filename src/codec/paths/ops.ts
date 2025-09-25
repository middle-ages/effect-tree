import {treeAna, treeCata, type Tree} from '#tree'
import {Order, pipe} from 'effect'
import {type NonEmptyArray2} from '#Array'
import {pathListFold} from './fold.js'
import {pathListUnfold} from './unfold.js'

/**
 * Encode a tree of type `A` into a non-empty list of paths to every leaf in the
 * encoded tree.
 * @category codec
 * @function
 */
export const encode: <A>(tree: Tree<A>) => NonEmptyArray2<A> =
  treeCata(pathListFold)

/**
 * Decode a list of leaf paths into a tree where. Every leaf given will appear
 * in the tree at the given path.
 *
 * An [Order](https://effect.website/docs/behaviour/order/) for your type is
 * required as the first argument.
 * @category codec
 * @function
 */
export const decode =
  <A>(order: Order.Order<A>) =>
  (pathList: NonEmptyArray2<A>): Tree<A> =>
    pipe(pathList, treeAna(pathListUnfold(order)))
