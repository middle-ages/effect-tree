import * as Tree from '#tree'
import {Option} from 'effect'
import {type Zipper} from './index.js'

/**
 * Get the current focus of the zipper.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns The focus of the zipper.
 * @category zipper
 * @function
 */
export const getFocus = <A>({focus}: Zipper<A>): Tree.Tree<A> => focus

/**
 * Get the value of the tree node under focus.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns Value of the focus node.
 * @category zipper
 * @function
 */
export const getValue = <A>({focus}: Zipper<A>): A => Tree.getValue(focus)

/**
 * Get the forest of the tree node under focus. Result could be an empty list if
 * the focused node is a {@link Leaf}.
 * @typeParam A - Underlying tree type.
 * @param self - The tree being queried.
 * @returns A possibly empty list of trees.
 * @category zipper
 * @function
 */
export const getForest = <A>({focus}: Zipper<A>): readonly Tree.Tree<A>[] =>
  Tree.getForest(focus)

/**
 * True if there are trees to the _left_ of the focus, false if focused node is
 * head in its forest.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns True if there are trees to the _left_ of the focus.
 * @category zipper
 * @function
 */
export const hasLefts = <A>({lefts}: Zipper<A>): boolean => lefts.length > 0

/**
 * True if there are trees to the _right_ of the focus, false if focused node is
 * last in its forest.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns True if there are trees to the _right_ of the focus.
 * @category zipper
 * @function
 */
export const hasRights = <A>({rights}: Zipper<A>): boolean => rights.length > 0

/**
 * Get the nodes to the left of the focus node.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns Possibly empty list of trees.
 * @category zipper
 * @function
 */
export const getLefts = <A>({lefts}: Zipper<A>): Tree.Tree<A>[] => lefts

/**
 * Get the nodes to the left of the focus node.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns Possibly empty list of trees.
 * @category zipper
 * @function
 */
export const getRights = <A>({rights}: Zipper<A>): Tree.Tree<A>[] => rights

/**
 * Get the depth of the zipper, where a zipper focused on the root node gets a
 * depth of `0`.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns Integer depth of the zipper.
 * @category zipper
 * @function
 */
export const getDepth = <A>({levels}: Zipper<A>): number => levels.length

/**
 * True if the zipper is currently focused on the tree root node.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns True if zipper is at root else false.
 * @category zipper
 * @function
 */
export const isRoot = <A>({parent}: Zipper<A>): boolean => Option.isNone(parent)

/**
 * True if the zipper is currently focused on a leaf.
 * @typeParam A - Underlying tree type.
 * @param zipper - Zipper to be queried.
 * @returns True if zipper is at leaf else false.
 * @category zipper
 * @function
 */
export const isLeaf = <A>({focus}: Zipper<A>): boolean => Tree.isLeaf(focus)
