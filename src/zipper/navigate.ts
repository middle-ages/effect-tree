import * as Tree from '#tree'
import {
  headNonEmpty,
  isNonEmptyArray,
  lastInit,
  lastNonEmpty,
} from '#util/Array'
import {dual, type EndoK} from '#util/Function'
import {flow, Option, pipe} from 'effect'
import {
  fromLevel,
  fromTree,
  pushSelf,
  toTree,
  type OptionalZipper,
  type Zipper,
  type ZipperType,
  type ZipperTypeLambda,
} from './index.js'

/**
 * Repeat the given navigation operator N times and return the final result or
 * `Option.none` if the operator fails along the way.
 *
 * See {@link repeat} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - How many times to apply the given navigation. No matter the
 * navigation repeated, if `n=0` the given zipper will be returned unchanged.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * the navigation failed because the path is invalid.
 * @category zipper
 */
export const tryRepeat: {
  <A>(self: Zipper<A>, n: number, nav: OptionalZipper): Option.Option<Zipper<A>>
  (n: number, nav: OptionalZipper): OptionalZipper
} = dual(
  3,
  <A>(
    self: Zipper<A>,
    n: number,
    nav: OptionalZipper,
  ): Option.Option<Zipper<A>> => {
    let current = self
    for (let index = 0; index < n; index++) {
      const option = nav(current)
      if (Option.isNone(option)) {
        return option
      }
      current = option.value
    }

    return Option.some(current)
  },
)

/**
 * Navigate from a node to its first child or return `Option.none` if the zipper
 * is focused on a leaf.
 *
 * See {@link head} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no first child.
 * @category zipper
 */
export const tryHead: OptionalZipper = self => {
  const {focus} = self
  if (Tree.isLeaf(focus)) {
    return Option.none()
  }

  const [, forest] = Tree.destructBranch<ZipperType<typeof self>>(focus)
  return Option.some({
    ...pushSelf(self),
    focus: headNonEmpty(forest),
    lefts: [],
    rights: forest.slice(1),
  })
}

/**
 * Navigate from a node to its first child N times to reach the Nth level of the
 * tree, or return `Option.none` if there is a leaf on the path from root to its
 * Nth 1st child down.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will return `Option.none` if given negative indexes.
 *
 * See {@link headN} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * the path to the Nth level is not valid.
 * @category zipper
 */
export const tryHeadN: {
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>>
  (n: number): <A>(self: Zipper<A>) => Option.Option<Zipper<A>>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>> =>
    tryRepeat(self, n, tryHead),
)

/**
 * Navigate from a node to its last child or return `Option.none` if the zipper
 * is focused on a leaf.
 *
 * See {@link last} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no last child.
 * @category zipper
 */
export const tryLast: OptionalZipper = self => {
  const {focus} = self
  if (Tree.isLeaf(focus)) {
    return Option.none()
  }

  const [, forest] = Tree.destructBranch<ZipperType<typeof self>>(focus)
  return Option.some({
    ...pushSelf(self),
    focus: lastNonEmpty(forest),
    lefts: forest.slice(0, -1),
    rights: [],
  })
}

/**
 * Navigate from a node to its last child N times to reach the Nth level of the
 * tree, or return `Option.none` if there is a leaf on the path from root to its
 * Nth 1st child down.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will return `Option.none` if given negative indexes.
 *
 * See {@link lastN} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * the path to the Nth level is not valid.
 * @category zipper
 */
export const tryLastN: {
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>>
  (n: number): <A>(self: Zipper<A>) => Option.Option<Zipper<A>>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>> =>
    tryRepeat(self, n, tryLast),
)

/**
 * Navigate from a node to its previous sibling or return `Option.none` if the
 * focused node is the head node in its forest.
 *
 * See {@link previous} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no previous sibling.
 * @category zipper
 */
export const tryPrevious: OptionalZipper = ({
  focus,
  lefts,
  rights,
  ...rest
}) => {
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
 * Navigate from a node to its next sibling or return `Option.none` if the
 * focused node is the last node in its forest.
 *
 * See {@link next} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * there is no next sibling.
 * @category zipper
 */
export const tryNext: OptionalZipper = ({focus, lefts, rights, ...rest}) => {
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
 * Navigate from a node to its parent or return `Option.none()` if the tree is
 * focused on a root node.
 *
 * See {@link up} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * zipper focus is on root node.
 * @category zipper
 */
export const tryUp: OptionalZipper = <A>({
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
 * Navigate from a node to its Nth child or return `Option.none` if it has no
 * Nth child.
 *
 * Negative indexes are handled as offsets from the final tree in the forest so
 * that focusing on index `-1` focuses on the last tree in the forest, `-2` on
 * the tree before that and so on.
 *
 * See {@link at} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - Index of child that will be the new zipper focus.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if
 * the node is a leaf or the given index is out-of-bounds.
 * @category zipper
 */
export const tryAt: {
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>>
  (n: number): <A>(self: Zipper<A>) => Option.Option<Zipper<A>>
} = dual(2, <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>> => {
  const {focus: oldFocus} = self

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
    ...pushSelf(self),
    focus,
    lefts,
    rights,
    parent: pipe(parentNode, Tree.getValue, Option.some),
  })
})

/**
 * Navigate from any node to the root node.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at the root node of the tree.
 * @category zipper
 */
export const root: EndoK<ZipperTypeLambda> = flow(toTree, fromTree)

/**
 * Repeat the given navigation operator N times and return the final result or
 * throw and exception if the operator fails along the way.
 * Unsafe version of {@link tryRepeat}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const repeat: {
  <A>(self: Zipper<A>, n: number, nav: OptionalZipper): Zipper<A>
  (n: number, nav: OptionalZipper): EndoK<ZipperTypeLambda>
} = dual(
  3,
  <A>(self: Zipper<A>, n: number, nav: OptionalZipper): Zipper<A> =>
    pipe(self, tryRepeat(n, nav), Option.getOrThrow),
)

/**
 * Navigate from a node to its first child or throw an exception if the focused
 * node is a {@link Leaf}. Unsafe version of {@link tryHead}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const head: EndoK<ZipperTypeLambda> = flow(tryHead, Option.getOrThrow)

/**
 * Navigate from a node to its first child N times to reach the Nth level of the
 * tree, or throw an exception if there is a leaf on the path from root to its
 * Nth 1st child down.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will throw an exception on negative indexes.
 *
 * Unsafe version of {@link tryHeadN}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const headN: {
  <A>(self: Zipper<A>, n: number): Zipper<A>
  (n: number): <A>(self: Zipper<A>) => Zipper<A>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Zipper<A> =>
    pipe(self, tryHeadN(n), Option.getOrThrow),
)

/**
 * Navigate from a node to its last child or throw an exception if the focused
 * node is a {@link Leaf}. Unsafe version of {@link tryLast}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const last: EndoK<ZipperTypeLambda> = flow(tryLast, Option.getOrThrow)

/**
 * Navigate from a node to its last child N times to reach the Nth level of the
 * tree, or throw an exception if there is a leaf on the path from root to its
 * Nth last child down.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will throw an exception on negative indexes.
 *
 * Unsafe version of {@link tryLastN}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const lastN: {
  <A>(self: Zipper<A>, n: number): Zipper<A>
  (n: number): <A>(self: Zipper<A>) => Zipper<A>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Zipper<A> =>
    pipe(self, tryLastN(n), Option.getOrThrow),
)

/**
 * Navigate from a node to its previous sibling or throw an exception if the
 * focused node is the forest head. Unsafe version of {@link tryPrevious}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const previous: EndoK<ZipperTypeLambda> = flow(
  tryPrevious,
  Option.getOrThrow,
)

/**
 * Navigate from a node to its next sibling or throw an exception if the
 * focused node is the last node in its forest. Unsafe version of
 * {@link tryNext}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const next: EndoK<ZipperTypeLambda> = flow(tryNext, Option.getOrThrow)

/**
 * Navigate from a node to its parent or throw an exception if the
 * focused node is a tree root. Unsafe version of {@link tryUp}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const up: EndoK<ZipperTypeLambda> = flow(tryUp, Option.getOrThrow)

/**
 * Navigate from a node to its Nth child or throw an exception if the given
 * index is beyond the last tree in the forest of the focused node. Unsafe
 * version of {@link tryAt}.
 *
 * Negative indexes are handled as offsets from the final tree in the forest so
 * that focusing on index `-1` focuses on the last tree in the forest, `-2` on
 * the tree before that and so on.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - Index of child that will be the new zipper focus.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const at: {
  <A>(self: Zipper<A>, n: number): Zipper<A>
  (n: number): EndoK<ZipperTypeLambda>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Zipper<A> =>
    pipe(tryAt(self, n), Option.getOrThrow),
)
