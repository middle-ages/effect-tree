/**
 * Zipper focus change combinators.
 * @module
 */
import {type EndoK} from '#util/Function'
import * as Tree from '#tree'
import {
  headNonEmpty,
  isNonEmptyArray,
  lastInit,
  lastNonEmpty,
} from '#util/Array'
import {flow, Option} from 'effect'
import {
  type OptionalZipper,
  type Zipper,
  type ZipperType,
  type ZipperTypeLambda,
  fromLevel,
  pushSelf,
} from './index.js'
import type {TupleOf} from 'effect/Types'

/**
 * Navigate from a node to its first child.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no first child.
 * @category ops
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
 * @category ops
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
 * @category ops
 */
export const previous: OptionalZipper = ({focus, lefts, rights, ...rest}) => {
  if (!isNonEmptyArray(lefts)) {
    return Option.none()
  }
  const [newFocus, ...newLefts] = lefts
  return Option.some({
    ...rest,
    focus: newFocus,
    lefts: [focus, ...rights],
    rights: newLefts,
  })
}

/**
 * Navigate from a node to its next sibling.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no next sibling.
 * @category ops
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
 * @category ops
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
