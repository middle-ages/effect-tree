import * as Tree from '#tree'
import {
  headNonEmpty,
  isNonEmptyArray,
  lastInit,
  lastNonEmpty,
  type NonEmptyArray,
} from '#Array'
import {dual, type EndoK} from '#Function'
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
import {tryRepeat} from './repeat.js'

/**
 * Navigate from a node to its first child or return `Option.none` if the zipper
 * is focused on a leaf.
 *
 * See {@link head} for an unsafe version.
 *
 * This is like {@link rewind} except it will descend one tree level.
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if there is no first child.
 * @category zipper
 * @function
 */
export const tryHead: OptionalZipper = self => {
  const {focus} = self
  if (Tree.isLeaf(focus)) {
    return Option.none()
  }

  const forest = Tree.getBranchForest<ZipperType<typeof self>>(focus)
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
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if the path to the Nth level is not valid.
 * @category zipper
 * @function
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
 *
 * This is like {@link end} except it will descend one tree level.
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if there is no last child.
 * @category zipper
 * @function
 */
export const tryLast: OptionalZipper = self => {
  const {focus} = self
  if (Tree.isLeaf(focus)) {
    return Option.none()
  }

  const forest = Tree.getBranchForest<ZipperType<typeof self>>(focus)
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
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if the path to the Nth level is not valid.
 * @category zipper
 * @function
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
 * Navigate from a node to its 1st sibling, rewinding the zipper to the head of
 * the focus forest. If the node is the only one in the forest or the focus is
 * already at the head, the zipper is returned unchanged.
 *
 * See {@link end} for the opposite navigation: jumping to the _end_ of the
 * focus forest.
 *
 * This is like {@link head} except it will remain on the same tree level.
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const rewind: EndoK<ZipperTypeLambda> = self => {
  const {lefts, rights: previousRights, focus: previousFocus, ...rest} = self
  if (!isNonEmptyArray(lefts)) {
    return self
  }
  const [focus, ...rights] = [...lefts, previousFocus, ...previousRights]
  return {
    ...rest,
    focus,
    lefts: [],
    rights,
  }
}

/**
 * Navigate from a node to its last sibling, sending the zipper to the end of
 * the focus forest. If the node is the only one in the forest or the focus is
 * already at the end, the zipper is returned unchanged.
 *
 * See {@link rewind} for the opposite navigation: jumping to the _beginning_ of
 * the focus forest.
 *
 * This is like {@link last} except it will remain on the same tree level.
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const end: EndoK<ZipperTypeLambda> = <A>(self: Zipper<A>) => {
  const {lefts: previousLefts, rights, focus: previousFocus, ...rest} = self
  if (!isNonEmptyArray(rights)) {
    return self
  }

  const [focus, lefts] = lastInit([
    ...previousLefts,
    previousFocus,
    ...rights,
  ] as NonEmptyArray<Tree.Tree<A>>)

  return {...rest, focus, lefts, rights: []}
}

/**
 * Navigate from a node to its previous sibling or return `Option.none` if the
 * focused node is the head node in its forest.
 *
 * See {@link previous} for an unsafe version.
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if there is no previous sibling.
 * @category zipper
 * @function
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
 * Navigate from a node to its previous sibling N times to reach the Nth sibling
 * left of the focus, or return `Option.none` if the focus index is less than
 * N.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will return `Option.none` if given negative indexes.
 *
 * See {@link previousN} for an unsafe version.
 * @typeParam A The underlying type of the tree.
 * @param n Number of siblings to skip to the left.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if `previous` cannot be repeated N times.
 * @category zipper
 * @function
 */
export const tryPreviousN: {
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>>
  (n: number): <A>(self: Zipper<A>) => Option.Option<Zipper<A>>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>> =>
    tryRepeat(self, n, tryPrevious),
)

/**
 * Navigate from a node to its next sibling or return `Option.none` if the
 * focused node is the last node in its forest.
 *
 * See {@link next} for an unsafe version.
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if there is no next sibling.
 * @category zipper
 * @function
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
 * Navigate from a node to its next sibling N times to reach the Nth sibling
 * right of the focus, or return `Option.none` if there are less than N trees to
 * the _right_ of the focus.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will return `Option.none` if given negative indexes.
 *
 * See {@link nextN} for an unsafe version.
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Number of siblings to skip to the left.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if `next` cannot be repeated N times.
 * @category zipper
 * @function
 */
export const tryNextN: {
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>>
  (n: number): <A>(self: Zipper<A>) => Option.Option<Zipper<A>>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Option.Option<Zipper<A>> =>
    tryRepeat(self, n, tryNext),
)

/**
 * Navigate from a node to its parent or return `Option.none()` if the tree is
 * focused on a root node.
 *
 * See {@link up} for an unsafe version.
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if zipper focus is on root node.
 * @category zipper
 * @function
 */
export const tryUp: OptionalZipper = <A>({
  parent,
  levels: previousLevels,
  focus,
  ...rest
}: Zipper<A>) => {
  if (Option.isNone(parent) || !isNonEmptyArray(previousLevels)) {
    return Option.none()
  }

  const [lastLevel, levels] = lastInit(previousLevels)
  return Option.some({
    focus: fromLevel(focus, {...rest, parent}),
    levels,
    ...lastLevel,
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
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Index of child that will be the new zipper focus.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if the node is a leaf or the given index is out-of-bounds.
 * @category zipper
 * @function
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
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at the root node of the tree.
 * @category zipper
 * @function
 */
export const root: EndoK<ZipperTypeLambda> = flow(toTree, fromTree)

/**
 * Navigate from a node to its first child or throw an exception if the focused
 * node is a {@link Leaf}. Unsafe version of {@link tryHead}.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 *
 * // ┬1
 * // ├┬2
 * // │├─3
 * // │└─4
 * // └┬5
 * //  ├─6
 * //  └─7
 * const tree = from(1, from(2, of(3), of(4)), from(5, of(6), of(7)))
 *
 * const start = Zipper.fromTree(tree)
 *
 * const hop1 = Zipper.head(start)
 * expect(Zipper.getValue(hop1)).toBe(2)
 *
 * const hop2 = Zipper.head(hop1)
 * expect(Zipper.getValue(hop2)).toBe(3)
 *
 * // Out-of-bounds exception when nowhere left to go.
 * expect(()  => Zipper.head(hop2)).toThrow(/getOrThrow/)
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
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
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
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
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 *
 * // ┬1
 * // ├┬2
 * // │├─3
 * // │└─4
 * // └┬5
 * //  ├─6
 * //  └─7
 * const tree = from(1, from(2, of(3), of(4)), from(5, of(6), of(7)))
 *
 * const start = Zipper.fromTree(tree)
 *
 * const hop1 = Zipper.last(start)
 * expect(Zipper.getValue(hop1)).toBe(5)
 *
 * const hop2 = Zipper.last(hop1)
 * expect(Zipper.getValue(hop2)).toBe(7)
 *
 * // Out-of-bounds exception when nowhere left to go.
 * expect(()  => Zipper.last(hop2)).toThrow(/getOrThrow/)
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
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
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Number of tree levels to descend.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
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
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * // ┬1
 * // ├─2
 * // ├─3
 * // └─4
 * const tree = from(1, of(2), of(3), of(4))
 *
 * const start = pipe(tree, Zipper.fromTree, Zipper.last)
 *
 * const hop1 = Zipper.previous(start)
 * expect(Zipper.getValue(hop1)).toBe(3)
 *
 * const hop2 = Zipper.previous(hop1)
 * expect(Zipper.getValue(hop2)).toBe(2)
 *
 * // Out-of-bounds exception when nowhere left to go.
 * expect(()  => Zipper.previous(hop2)).toThrow(/getOrThrow/)
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const previous: EndoK<ZipperTypeLambda> = flow(
  tryPrevious,
  Option.getOrThrow,
)

/**
 * Navigate from a node to its previous sibling N times to reach the Nth sibling
 * left of the focus, or throw an exception if the focus index is less than N.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will throw an exception on negative indexes.
 *
 * Unsafe version of {@link tryPreviousN}.
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Number of siblings to skip to the left.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const previousN: {
  <A>(self: Zipper<A>, n: number): Zipper<A>
  (n: number): <A>(self: Zipper<A>) => Zipper<A>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Zipper<A> =>
    pipe(self, tryPreviousN(n), Option.getOrThrow),
)

/**
 * Navigate from a node to its next sibling or throw an exception if the
 * focused node is the last node in its forest. Unsafe version of
 * {@link tryNext}.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * // ┬1
 * // ├─2
 * // ├─3
 * // └─4
 * const tree = from(1, of(2), of(3), of(4))
 *
 * const start = pipe(tree, Zipper.fromTree, Zipper.head)
 *
 * const hop1 = Zipper.next(start)
 * expect(Zipper.getValue(hop1)).toBe(3)
 *
 * const hop2 = Zipper.next(hop1)
 * expect(Zipper.getValue(hop2)).toBe(4)
 *
 * // Out-of-bounds exception when nowhere left to go.
 * expect(()  => Zipper.next(hop2)).toThrow(/getOrThrow/)
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const next: EndoK<ZipperTypeLambda> = flow(tryNext, Option.getOrThrow)

/**
 * Navigate from a node to its next sibling N times to reach the Nth sibling
 * right of the focus, or throw an exception if there are less than N trees to
 * the _right_ of the focus.
 *
 * When `n` is zero, the zipper is returned unchanged.
 *
 * Will throw an exception on negative indexes.
 *
 * Unsafe version of {@link tryPreviousN}.
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Number of siblings to skip to the right.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const nextN: {
  <A>(self: Zipper<A>, n: number): Zipper<A>
  (n: number): <A>(self: Zipper<A>) => Zipper<A>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Zipper<A> =>
    pipe(self, tryNextN(n), Option.getOrThrow),
)

/**
 * Navigate from a node to its parent or throw an exception if the
 * focused node is a tree root. Unsafe version of {@link tryUp}.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * // ┬1
 * // ├┬2
 * // │├─3
 * // │└─4
 * // └┬5
 * //  ├─6
 * //  └─7
 * const tree = from(1, from(2, of(3), of(4)), from(5, of(6), of(7)))
 *
 * const start = pipe(tree, Zipper.fromTree, Zipper.head, Zipper.head)
 *
 * const hop1 = Zipper.up(start)
 * expect(Zipper.getValue(hop1)).toBe(2)
 *
 * const hop2 = Zipper.up(hop1)
 * expect(Zipper.getValue(hop2)).toBe(1)
 *
 * // Out-of-bounds exception when nowhere left to go.
 * expect(()  => Zipper.up(hop2)).toThrow(/getOrThrow/)
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
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
 * @typeParam A The underlying type of the tree.
 * @param self The zipper that will be navigated.
 * @param n Index of child that will be the new zipper focus.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const at: {
  <A>(self: Zipper<A>, n: number): Zipper<A>
  (n: number): EndoK<ZipperTypeLambda>
} = dual(
  2,
  <A>(self: Zipper<A>, n: number): Zipper<A> =>
    pipe(tryAt(self, n), Option.getOrThrow),
)
