import {treeAna, treeCata, type Tree} from '#tree'
import {Order, pipe} from 'effect'
import {type NonEmptyArray2} from '#util/Array'
import {pathListFold} from './fold.js'
import {pathListUnfold} from './unfold.js'

export const encode: <A>(tree: Tree<A>) => NonEmptyArray2<A> =
  treeCata(pathListFold)

export const decode =
  <A>(order: Order.Order<A>) =>
  (pathList: NonEmptyArray2<A>): Tree<A> =>
    pipe(pathList, treeAna(pathListUnfold(order)))
