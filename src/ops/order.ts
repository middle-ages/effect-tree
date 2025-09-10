/** Folds and unfolds for controlling tree node _order_. */
import {type Tree, treeCata, type TreeFolder} from '#tree'
import * as TreeF from '#treeF'
import {Array, flow, identity, Option, Order, pipe, Tuple} from 'effect'
import {pair} from '#util/Pair'

/** Return the smallest value in the tree according to the given order. */
export const minimumNode =
    <A>(Order: Order.Order<A>) =>
    (tree: Tree<A>): A =>
      pipe(tree, treeCata(minimumNodeFold(Order))),
  /** Return the largest value in the tree according to the given order. */
  maximumNode =
    <A>(Order: Order.Order<A>) =>
    (tree: Tree<A>): A =>
      pipe(tree, treeCata(maximumNodeFold(Order))),
  /** Return the smallest leaf in the tree according to the given order. */
  minimumLeaf =
    <A>(Order: Order.Order<A>) =>
    (tree: Tree<A>): A =>
      pipe(tree, treeCata(minimumLeafFold(Order))),
  /** Return the largest leaf in the tree according to the given order. */
  maximumLeaf =
    <A>(Order: Order.Order<A>) =>
    (tree: Tree<A>): A =>
      pipe(tree, treeCata(maximumLeafFold(Order)))

/**
 * Just like `minimumLeaf` but returns the leaf tupled with its parent or `None`
 * if the tree if a leaf.
 */
export const minimumLeafAndParent = <A>(
  Order: Order.Order<A>,
): ((self: Tree<A>) => readonly [A, Option.Option<A>]) =>
  treeCata(minimumLeafParentFold(Order))

/**
 * Just like `maximumLeaf` but returns the leaf tupled with its parent or `None`
 * if the tree if a leaf.
 */
export const maximumLeafAndParent = <A>(
  Order: Order.Order<A>,
): ((self: Tree<A>) => readonly [A, Option.Option<A>]) =>
  treeCata(maximumLeafAndParentFold(Order))

/** Find minimum node at tree level. */
export const minimumNodeFold: <A>(Order: Order.Order<A>) => TreeFolder<A, A> =
  Order => self =>
    Array.min(Order)([
      TreeF.getNode(self),
      ...(TreeF.isBranch(self) ? TreeF.getForest(self) : []),
    ])

/** Find maximum node at tree level. */
export const maximumNodeFold: <A>(Order: Order.Order<A>) => TreeFolder<A, A> =
  Order => self =>
    Array.max(Order)([TreeF.getNode(self), ...TreeF.getForest(self)])

/** Find minimum leaf at tree level. */
export const minimumLeafFold: <A>(Order: Order.Order<A>) => TreeFolder<A, A> =
  Order => treeF =>
    pipe(
      treeF,
      TreeF.match({
        onLeaf: identity,
        onBranch: (_, forest) => Array.min(Order)(forest),
      }),
    )

/** Find minimum leaf at tree level. */
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
 */
export const minimumLeafParentFold = <A>(
  o: Order.Order<A>,
): TreeFolder<A, readonly [A, Option.Option<A>]> =>
  TreeF.match({
    onLeaf: pair.withSecond(Option.none<A>()),
    onBranch: (node, forest) =>
      pipe(
        forest,
        Array.min(parentOrder(o)),
        Tuple.mapSecond(Option.orElse<A>(() => Option.some(node))),
      ),
  })

/**
 * Just like `maximumLeafFold` but result include the parent node of the
 * maximal leaf, or `None` if given tree is a leaf.
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
