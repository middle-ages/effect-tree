import {apply, constFalse, constTrue} from '#Function'
import {orderToEqual} from '#Order'
import {
  leaf,
  tree,
  treeCata,
  treeCataEffect,
  type Tree,
  type TreeEffectFolder,
  type TreeFolder,
} from '#tree'
import * as TreeF from '#treeF'
import {
  Array,
  Effect,
  Equivalence,
  Option,
  Order,
  Predicate,
  identity,
  pipe,
} from 'effect'
import {minimumLeafParentFold} from './order.js'

/**
 * True if `needle` is found in the tree.
 *
 * Will short-circuit and return immediately if the needle is found.
 * @example
 * import {includes, from, of} from 'effect-tree'
 * import {Number} from 'effect'
 *
 * const tree = from(1, of(2), from(4, of(5)))
 *
 * const hasNumber = includes(Number.Equivalence)
 *
 * expect(hasNumber(3)(tree), 'not found').toBe(false)
 * expect(hasNumber(5)(tree), 'found').toBe(true)
 * @category ops
 * @function
 */
//:
export const includes =
  <A>(
    equals: Equivalence.Equivalence<A>,
  ): ((a: A) => Predicate.Predicate<Tree<A>>) =>
  a =>
  tree =>
    pipe(
      a,
      includesFold(equals),
      treeCataEffect,
      apply(tree),
      Effect.match({
        onFailure: constTrue,
        onSuccess: constFalse,
      }),
      Effect.runSync,
    )

/**
 * Filter out the minimal leaf for the given order and return a tuple with:
 *
 * 1. The given tree with its minimal leaf removed.
 * 2. The minimal leaf that was removed.
 * 3. The minimal leaf parent, or `None` if the tree is a leaf.
 * @category ops
 * @function
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

/**
 * Filter nodes so that only those satisfying the given predicate remain.
 * @category ops
 * @function
 */
export const filterNodes: <A>(
  predicate: Predicate.Predicate<Tree<A>>,
) => (self: Tree<A>) => Tree<A> = predicate =>
  pipe(predicate, filterNodesFold, treeCata)

/**
 * Filter leaves so that only those satisfying the given predicate remain.
 * @category ops
 * @function
 */
export const filterLeaves: <A>(
  predicate: Predicate.Predicate<A>,
) => (self: Tree<A>) => Tree<A> = predicate =>
  pipe(predicate, filterLeavesFold, treeCata)

/**
 * True if `needle` is found in a tree level.
 *
 * Searches the entire tree but will short-circuit if the needle is found.
 * @category fold
 * @function
 */
//
export const includesFold =
  <A>(equals: Equivalence.Equivalence<A>) =>
  (needle: A): TreeEffectFolder<A, void, undefined> =>
  treeF =>
    equals(TreeF.getValue(treeF), needle)
      ? Effect.fail(void {})
      : Effect.succeed({})

/**
 * Filter nodes at a tree level.
 * @category fold
 * @function
 */
export const filterNodesFold = <A>(
  predicate: Predicate.Predicate<Tree<A>>,
): TreeFolder<A, Tree<A>> =>
  TreeF.match({
    onLeaf: leaf,
    onBranch: (value, forest) =>
      tree(value, pipe(forest, Array.filter(predicate))),
  })

/**
 * Filter leaves at a level algebra.
 * @category fold
 * @function
 */
export const filterLeavesFold = <A>(
  predicate: Predicate.Predicate<A>,
): TreeFolder<A, Tree<A>> =>
  filterNodesFold(
    ({unfixed}) =>
      TreeF.length(unfixed) !== 0 || pipe(unfixed, TreeF.getValue, predicate),
  )
