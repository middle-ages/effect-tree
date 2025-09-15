import * as Tree from '#tree'
import {type EndoOf} from '#util/Function'
import {Option, pipe} from 'effect'
import {type Zipper} from './index.js'
import {head, last, unsafeHead, unsafeLast} from './navigate.js'

/**
 * Replace the focus tree node of the zipper with the given tree node.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be modified.
 * @returns An updated zipper where the focus node has been replaced.
 * @category zipper
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
 * At the keys `move` and `unsafeMove` you will find versions where the focus
 * has been _moved_ to the newly inserted node.
 *
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be modified.
 * @returns An updated zipper where the given node has been inserted.
 * @category zipper
 */
export const prepend =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({focus, ...rest}) => ({
    ...rest,
    focus: Tree.prepend(focus, that),
  })

prepend.move =
  <A>(that: Tree.Tree<A>) =>
  (zipper: Zipper<A>): Option.Option<Zipper<A>> =>
    pipe(zipper, prepend(that), head)

prepend.unsafeMove =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  zipper =>
    pipe(zipper, prepend(that), unsafeHead)

/**
 * Insert the given node _after_ the zipper focus.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be modified.
 * @returns An updated zipper where the given node has been added.
 * @category zipper
 */
export const append =
  <A>(add: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({rights, ...rest}) => ({
    ...rest,
    rights: [add, ...rights],
  })

append.move =
  <A>(that: Tree.Tree<A>) =>
  (zipper: Zipper<A>): Option.Option<Zipper<A>> =>
    pipe(zipper, append(that), last)

append.unsafeMove =
  <A>(that: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  zipper =>
    pipe(zipper, append(that), unsafeLast)
