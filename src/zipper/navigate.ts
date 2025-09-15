import * as Tree from '#tree'
import {
  headNonEmpty,
  isNonEmptyArray,
  lastInit,
  lastNonEmpty,
} from '#util/Array'
import {type EndoK} from '#util/Function'
import {flow, Option, pipe} from 'effect'
import type {TupleOf} from 'effect/Types'
import {
  fromLevel,
  pushSelf,
  type OptionalZipper,
  type Zipper,
  type ZipperType,
  type ZipperTypeLambda,
} from './index.js'

/**
 * Navigate from a node to its first child.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no first child.
 * @category zipper
 */
export const head: OptionalZipper = zipper => {
  const {focus} = zipper
  if (Tree.isLeaf(focus)) {
    return Option.none()
  }

  const [, forest] = Tree.destructBranch<ZipperType<typeof zipper>>(focus)
  return Option.some({
    ...pushSelf(zipper),
    focus: headNonEmpty(forest),
    lefts: [],
    rights: forest.slice(1),
  })
}

/**
 * Navigate from a node to its last child.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no last child.
 * @category zipper
 */
export const last: OptionalZipper = zipper => {
  const {focus} = zipper
  if (Tree.isLeaf(focus)) {
    return Option.none()
  }

  const [, forest] = Tree.destructBranch<ZipperType<typeof zipper>>(focus)
  return Option.some({
    ...pushSelf(zipper),
    focus: lastNonEmpty(forest),
    lefts: forest.slice(0, -1),
    rights: [],
  })
}

/**
 * Navigate from a node to its previous sibling.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no previous sibling.
 * @category zipper
 */
export const previous: OptionalZipper = ({focus, lefts, rights, ...rest}) => {
  if (!isNonEmptyArray(lefts)) {
    return Option.none()
  }
  const [newFocus, newLefts] = lastInit(lefts)
  return Option.some({
    ...rest,
    focus: newFocus,
    lefts: newLefts,
    rights: [focus, ...rights],
  })
}

/**
 * Navigate from a node to its next sibling.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no next sibling.
 * @category zipper
 */
export const next: OptionalZipper = ({focus, lefts, rights, ...rest}) => {
  if (!isNonEmptyArray(rights)) {
    return Option.none()
  }
  const [newFocus, ...newRights] = rights
  return Option.some({
    ...rest,
    focus: newFocus,
    lefts: [...lefts, focus],
    rights: newRights,
  })
}

/**
 * Navigate from a node to its parent.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * zipper is pointing at root node.
 * @category zipper
 */
export const up: OptionalZipper = <A>({
  parent,
  levels,
  focus,
  ...rest
}: Zipper<A>) => {
  if (Option.isNone(parent) || !isNonEmptyArray(levels)) {
    return Option.none()
  }

  const [init, last] = lastInit(levels)
  return Option.some({
    focus: fromLevel(focus, {...rest, parent}),
    levels: last,
    ...init,
  })
}

/**
 * Navigate from a node to its Nth child.
 *
 * Negative indexes are handled as offsets from the final tree in the forest so
 * that focusing on index `-1` focuses on the last tree in the forest, `-2` on
 * the tree before that and so on.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @param n - Index of child that will be the new zipper focus.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * the node is a leaf or the given index is out-of-bounds.
 * @category zipper
 */
export const at = <A>(
  zipper: Zipper<A>,
  n: number,
): Option.Option<Zipper<A>> => {
  const {focus: oldFocus} = zipper

  const length = Tree.length(oldFocus)
  const index = n + (n < 0 ? length : 0)
  if (Tree.isLeaf(oldFocus) || index >= Tree.length(oldFocus)) {
    return Option.none()
  }
  const parentNode: Tree.Branch<A> = oldFocus
  const oldForest = Tree.getBranchForest(parentNode)
  const [lefts, focus, rights] = [
    oldForest.slice(0, n),
    oldForest.at(index) as Tree.Tree<A>,
    oldForest.slice(n),
  ]

  return Option.some({
    ...pushSelf(zipper),
    focus,
    lefts,
    rights,
    parent: pipe(parentNode, Tree.getValue, Option.some),
  })
}

export const [
  unsafeHead,
  unsafeLast,
  unsafePrevious,
  unsafeNext,
  unsafeUp,
]: TupleOf<5, EndoK<ZipperTypeLambda>> = [
  flow(head, Option.getOrThrow),
  flow(last, Option.getOrThrow),
  flow(previous, Option.getOrThrow),
  flow(next, Option.getOrThrow),
  flow(up, Option.getOrThrow),
]

export const unsafeAt: <A>(zipper: Zipper<A>, n: number) => Zipper<A> = flow(
  at,
  Option.getOrThrow,
)
