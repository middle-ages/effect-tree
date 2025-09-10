import {type TreeUnfolder} from '#tree'
import * as TreeF from '#treeF'
import {type NonEmptyArray2} from '#util/Array'
import {orderToEqual} from '#util/Order'
import {Array, Equivalence, Order, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'

/**
 * Build a tree from a list of paths and an order. For example:
 * ```ts
 * const paths = [['A', 'B'], ['A', 'C', 'D'], ['A', 'C', 'E']]
 *
 * const tree = treeAna(pathListUnfold(STR.Order))(paths)
 * // A(B, C(D, E))
 * ```
 * @category unfold
 */
export const pathListUnfold =
  <A>(order: Order.Order<A>): TreeUnfolder<A, NonEmptyArray2<A>> =>
  paths => {
    const pathOrder = pipe(
      order,
      Order.mapInput<[A, ...A[]], A>(Array.headNonEmpty<A>),
    ) as Order.Order<A[]>

    const pathsEquals: Equivalence.Equivalence<NonEmptyArray<A>> =
      orderToEqual(pathOrder)

    const head: A = paths[0][0]

    const filtered = pipe(
      paths,
      Array.map(Array.tailNonEmpty),
      Array.filter(Array.isNonEmptyReadonlyArray),
    )

    return Array.isNonEmptyReadonlyArray(filtered)
      ? TreeF.branchF(
          head,
          Array.groupWith(
            pipe(filtered as NonEmptyArray2<A>, Array.sortBy(pathOrder)),
            pathsEquals,
          ),
        )
      : TreeF.leafF(head)
  }
