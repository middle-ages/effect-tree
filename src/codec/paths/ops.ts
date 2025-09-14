import {treeAna, treeCata, type Tree} from '#tree'
import {Order, pipe} from 'effect'
import {type NonEmptyArray2} from '#util/Array'
import {pathListFold} from './fold.js'
import {pathListUnfold} from './unfold.js'

/**
 * Encode a tree of type `A` into a non-empty list of paths to every leaf in the
 * encoded tree.
 * @category codec
 */
export const encode: <A>(tree: Tree<A>) => NonEmptyArray2<A> =
  treeCata(pathListFold)

/**
 * Decode a list of leaf paths into a tree where. Every leaf given will appear
 * in the tree at the given path.
 * @category codec
 */
export const decode =
  <A>(order: Order.Order<A>) =>
  (pathList: NonEmptyArray2<A>): Tree<A> =>
    pipe(pathList, treeAna(pathListUnfold(order)))
