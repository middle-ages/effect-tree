import * as Tree from '#tree'
import {isNonEmptyArray, lastInit} from '#Array'
import {type EndoOf} from '#Function'
import {Option, pipe} from 'effect'
import {hasRights} from './data.js'
import {type OptionalZipper, type Zipper} from './index.js'
import {next, tryHead, tryLast} from './navigate.js'

/**
 * Replace the focus tree node of the zipper with the given tree node.
 * @typeParam A The underlying type of the tree.
 * @returns A function that takes a zipper and returns an updated zipper where the focus node has been replaced.
 * @category zipper
 * @function
 */
export const replace =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({focus: _, ...rest}) => ({
    ...rest,
    focus: that,
  })

/**
 * Insert the given node as the first child of the given focus.
 *
 * At the keys `move` and `tryMove` you will find versions where the focus
 * has been _moved_ to the newly inserted node.
 *
 * @typeParam A The underlying type of the tree.
 * @returns A function that takes a zipper and returns an updated zipper where the focus node has been replaced.
 * @category zipper
 * @function
 */
export const prepend =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({focus, ...rest}) => ({
    ...rest,
    focus: Tree.prepend(focus, that),
  })

prepend.tryMove =
  <A>(that: Tree.Tree<A>) =>
  (zipper: Zipper<A>): Option.Option<Zipper<A>> =>
    pipe(zipper, prepend(that), tryHead)

prepend.move =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  zipper =>
    pipe(zipper, prepend.tryMove(that), Option.getOrThrow)

/**
 * Append the given node as the last child of the given focus.
 *
 * At the keys `move` and `unsafeMove` you will find versions where the focus
 * has been _moved_ to the newly appended node.
 *
 * @typeParam A The underlying type of the tree.
 * @returns A function that takes a zipper and returns an updated zipper where the focus node has been replaced.
 * @category zipper
 * @function
 */
export const append =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({focus, ...rest}) => ({
    ...rest,
    focus: Tree.append(focus, that),
  })

append.tryMove =
  <A>(that: Tree.Tree<A>) =>
  (zipper: Zipper<A>): Option.Option<Zipper<A>> =>
    pipe(zipper, append(that), tryLast)

append.move =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  zipper =>
    pipe(zipper, append.tryMove(that), Option.getOrThrow)

/**
 * Remove the current focused tree node from the tree, and return the zipper
 * focused on the _next_ sibling. In case none exists focuses _up_ on the
 * parent of the removed node.
 *
 * If the zipper is focused on tree root returns `Option.none()`.
 * @typeParam A The underlying type of the tree.
 * @returns A zipper without the previously focused node focused on next node, or failing that, on the parent node. If the zipper is focused on the tree root returns `Option.none()`.
 * @category zipper
 * @function
 */
export const remove: OptionalZipper = <A>(self: Zipper<A>) => {
  // Try to remove, then move _next_ in forest.
  if (hasRights(self)) {
    const {lefts, ...rest} = next(self)
    // Discard final element in “lefts” because we just moved right and that is
    // where the focus node we need to remove will be found.
    return Option.some({...rest, lefts: lefts.splice(0, -1)})
  }

  const {levels: previousLevels, parent: previousParent, lefts, rights} = self
  if (!isNonEmptyArray(previousLevels)) {
    return Option.none()
  }

  // Remove and move _up_.
  const [lastLevel, levels] = lastInit(previousLevels)
  return Option.some({
    focus: Tree.from(
      (previousParent as Option.Some<A>).value,
      ...lefts, // Previous focus node is NOT added.
      ...rights,
    ),
    levels,
    ...lastLevel,
  })
}
