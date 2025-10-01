import {type Tree, treeCata, type TreeFolder} from '#tree'
import * as TreeF from '#treeF'
import {Array, flow, identity, Option, Order, pipe, Tuple} from 'effect'
import {pair} from '#Pair'

/**
 * Return the smallest value in the tree according to the given order.
 * @example
 * import {from, of, minimumNode} from 'effect-tree'
 * import {Number} from 'effect'
 *
 * const tree = from(100, of(10), from(1_000, of(1)))
 *
 * expect(minimumNode(Number.Order)(tree)).toBe(1)
 * @category ops
 * @function
 */
export const minimumNode =
  <A>(Order: Order.Order<A>) =>
  (tree: Tree<A>): A =>
    pipe(tree, treeCata(minimumNodeFold(Order)))

/**
 * Return the largest value in the tree according to the given order.
 * @example
 * import {from, of, maximumNode} from 'effect-tree'
 * import {Number} from 'effect'
 *
 * const tree = from(100, of(10), from(1_000, of(1)))
 *
 * expect(maximumNode(Number.Order)(tree)).toBe(1_000)
 * @category ops
 * @function
 */
export const maximumNode =
  <A>(Order: Order.Order<A>) =>
  (tree: Tree<A>): A =>
    pipe(tree, treeCata(maximumNodeFold(Order)))

/**
 * Return the smallest leaf in the tree according to the given order.
 * @example
 * import {from, of, minimumLeaf} from 'effect-tree'
 * import {Number} from 'effect'
 *
 * const tree = from(100, of(1_000), from(1, of(10)))
 *
 * expect(minimumLeaf(Number.Order)(tree)).toBe(10)
 * @category ops
 * @function
 */
export const minimumLeaf =
  <A>(Order: Order.Order<A>) =>
  (tree: Tree<A>): A =>
    pipe(tree, treeCata(minimumLeafFold(Order)))

/**
 * Return the largest leaf in the tree according to the given order.
 * @example
 * import {from, of, maximumLeaf} from 'effect-tree'
 * import {Number} from 'effect'
 *
 * const tree = from(10, of(1), from(1_000, of(100)))
 *
 * expect(maximumLeaf(Number.Order)(tree)).toBe(100)
 * @category ops
 * @function
 */
export const maximumLeaf =
  <A>(Order: Order.Order<A>) =>
  (tree: Tree<A>): A =>
    pipe(tree, treeCata(maximumLeafFold(Order)))

/**
 * Just like `minimumLeaf` but returns the leaf tupled with its parent or `None`
 * if the tree if a leaf.
 * @category ops
 * @function
 */
export const minimumLeafAndParent = <A>(
  Order: Order.Order<A>,
): ((self: Tree<A>) => readonly [A, Option.Option<A>]) =>
  treeCata(minimumLeafParentFold(Order))

/**
 * Just like `maximumLeaf` but returns the leaf tupled with its parent or `None`
 * if the tree if a leaf.
 * @category ops
 * @function
 */
export const maximumLeafAndParent = <A>(
  Order: Order.Order<A>,
): ((self: Tree<A>) => readonly [A, Option.Option<A>]) =>
  treeCata(maximumLeafAndParentFold(Order))

/**
 * Find minimum node at tree level.
 * @category fold
 * @function
 */
export const minimumNodeFold: <A>(Order: Order.Order<A>) => TreeFolder<A, A> =
  Order => self =>
    Array.min(Order)([
      TreeF.getValue(self),
      ...(TreeF.isBranch(self) ? TreeF.getForest(self) : []),
    ])

/**
 * Find maximum node at tree level.
 * @category fold
 * @function
 */
export const maximumNodeFold: <A>(Order: Order.Order<A>) => TreeFolder<A, A> =
  Order => self =>
    Array.max(Order)([TreeF.getValue(self), ...TreeF.getForest(self)])

/**
 * Find minimum leaf at tree level.
 * @category fold
 * @function
 */
export const minimumLeafFold: <A>(Order: Order.Order<A>) => TreeFolder<A, A> =
  Order => treeF =>
    pipe(
      treeF,
      TreeF.match({
        onLeaf: identity,
        onBranch: (_, forest) => Array.min(Order)(forest),
      }),
    )

/**
 * Find minimum leaf at tree level.
 * @category fold
 * @function
 */
export const maximumLeafFold: <A>(Order: Order.Order<A>) => TreeFolder<A, A> =
  Order => treeF =>
    pipe(
      treeF,
      TreeF.match({
        onLeaf: identity,
        onBranch: (_, forest) => Array.max(Order)(forest),
      }),
    )

/**
 * Just like `minimumLeafFold` but result include the parent node of the
 * minimal leaf, or `None` if given tree is a leaf.
 * @category fold
 * @function
 */
export const minimumLeafParentFold = <A>(
  o: Order.Order<A>,
): TreeFolder<A, readonly [A, Option.Option<A>]> =>
  TreeF.match({
    onLeaf: pair.withSecond(Option.none<A>()),
    onBranch: (value, forest) =>
      pipe(
        forest,
        Array.min(parentOrder(o)),
        Tuple.mapSecond(Option.orElse<A>(() => Option.some(value))),
      ),
  })

/**
 * Just like `maximumLeafFold` but result include the parent node of the
 * maximal leaf, or `None` if given tree is a leaf.
 * @category fold
 * @function
 */
export const maximumLeafAndParentFold: typeof minimumLeafParentFold = flow(
  Order.reverse,
  minimumLeafParentFold,
)

function parentOrder<A>(
  o: Order.Order<A>,
): Order.Order<readonly [A, Option.Option<A>]> {
  return pipe(o, Order.mapInput(Tuple.getFirst))
}
