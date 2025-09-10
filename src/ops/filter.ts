/** Folds and unfolds for _filtering_. */
import {type Tree, type TreeFolder, leaf, tree, treeCata} from '#tree'
import * as TreeF from '#treeF'
import {orderToEqual} from '#util/Order'
import {
  Array,
  Boolean,
  Equivalence,
  Option,
  Order,
  Predicate,
  flow,
  identity,
  pipe,
} from 'effect'
import {minimumLeafParentFold} from './order.js'

/** True if `needle` is found in the tree. */
export const includes = <A>(
  equals: Equivalence.Equivalence<A>,
): ((a: A) => Predicate.Predicate<Tree<A>>) =>
  flow(includesFold(equals), treeCata)

/**
 * Filter out the minimal leaf for the given order and return a tuple with:
 *
 * 1. The given tree with its minimal leaf removed.
 * 2. The minimal leaf that was removed.
 * 3. The minimal leaf parent, or `None` if the tree is a leaf.
 */
export const filterMinimumLeaf =
  <A>(order: Order.Order<A>) =>
  (
    t: Tree<A>,
  ): [filtered: Tree<A>, minLeaf: A, maybeParent: Option.Option<A>] => {
    const [minLeaf, maybeParent]: readonly [A, Option.Option<A>] = pipe(
      order,
      minimumLeafParentFold,
      treeCata,
    )(t)

    return [
      (Option.isNone(maybeParent)
        ? identity
        : pipe(
            minLeaf,
            orderToEqual.curried(order),
            Predicate.not,
            filterLeaves,
          ))(t),
      minLeaf,
      maybeParent,
    ]
  }

/** Filter nodes so that only those satisfying the given predicate remain. */
export const filterNodes: <A>(
  predicate: Predicate.Predicate<Tree<A>>,
) => (self: Tree<A>) => Tree<A> = predicate =>
  pipe(predicate, filterNodesFold, treeCata)

/** Filter leaves so that only those satisfying the given predicate remain. */
export const filterLeaves: <A>(
  predicate: Predicate.Predicate<A>,
) => (self: Tree<A>) => Tree<A> = predicate =>
  pipe(predicate, filterLeavesFold, treeCata)

/** True if `needle` is found in tree level. */
export const includesFold =
  <A>(
    equals: Equivalence.Equivalence<A>,
  ): ((needle: A) => TreeFolder<A, boolean>) =>
  a =>
    TreeF.match({
      onLeaf: node => equals(a, node),
      onBranch: (node, forest) => equals(a, node) || Boolean.some(forest),
    })

/** Filter nodes at a level algebra. */
export const filterNodesFold = <A>(
  predicate: Predicate.Predicate<Tree<A>>,
): TreeFolder<A, Tree<A>> =>
  TreeF.match({
    onLeaf: leaf,
    onBranch: (node, forest) =>
      tree(node, pipe(forest, Array.filter(predicate))),
  })

/** Filter leaves at a level algebra. */
export const filterLeavesFold = <A>(
  predicate: Predicate.Predicate<A>,
): TreeFolder<A, Tree<A>> =>
  filterNodesFold(
    ({unfixed}) =>
      TreeF.length(unfixed) !== 0 || pipe(unfixed, TreeF.getNode, predicate),
  )
