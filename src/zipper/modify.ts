/**
 * Modifying trees with zippers.
 * @module
 */
import * as Tree from '#tree'
import {type EndoOf} from '#util/Function'
import {type Zipper} from './index.js'

/**
 * Replace the focus tree node of the zipper with the given tree node.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be modified.
 * @returns An updated zipper where the focus node has been replaced.
 * @category ops
 */
export const replace =
  <A>(replace: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({focus: _, ...rest}) => ({
    ...rest,
    focus: replace,
  })

/**
 * Insert the given node _before_ the zipper focus.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be modified.
 * @returns An updated zipper where the given node has been inserted.
 * @category ops
 */
export const insert =
  <A>(insert: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({lefts, ...rest}) => ({
    ...rest,
    lefts: [...lefts, insert],
  })

/**
 * Insert the given node _after_ the zipper focus.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be modified.
 * @returns An updated zipper where the given node has been added.
 * @category ops
 */
export const add =
  <A>(add: Tree.Tree<A>): EndoOf<Zipper<A>> =>
  ({rights, ...rest}) => ({
    ...rest,
    rights: [add, ...rights],
  })
