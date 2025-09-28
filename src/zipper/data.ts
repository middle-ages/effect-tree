import * as Tree from '#tree'
import {Option} from 'effect'
import {type Zipper} from './index.js'

/**
 * Get the current focus of the zipper.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2))
 *
 * const zipper = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head,
 * )
 *
 * expect(Zipper.getFocus(zipper)).toEqual(of(2))
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns The focus of the zipper.
 * @category zipper
 * @function
 */
export const getFocus = <A>({focus}: Zipper<A>): Tree.Tree<A> => focus

/**
 * Get the value of the tree node under focus.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2))
 *
 * const zipper = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head,
 * )
 *
 * expect(Zipper.getValue(zipper)).toBe(2)
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns Value of the focus node.
 * @category zipper
 * @function
 */
export const getValue = <A>({focus}: Zipper<A>): A => Tree.getValue(focus)

/**
 * Get the forest of the tree node under focus. Result could be an empty list if
 * the focused node is a {@link Leaf}.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 *
 * const tree = from(1, of(2))
 * const zipper = Zipper.fromTree(tree)
 *
 * expect(Zipper.getForest(zipper)).toEqual([of(2)])
 * @typeParam A Underlying tree type.
 * @param self The tree being queried.
 * @returns A possibly empty list of trees.
 * @category zipper
 * @function
 */
export const getForest = <A>({focus}: Zipper<A>): readonly Tree.Tree<A>[] =>
  Tree.getForest(focus)

/**
 * True if there are trees to the _left_ of the focus, false if focused node is
 * head in its forest.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2), of(3))
 *
 * const zipper = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head
 * )
 *
 * expect(Zipper.hasLefts(zipper)).toBe(false)
 *
 * const moved = Zipper.next(zipper)
 *
 * expect(Zipper.hasLefts(moved)).toBe(true)
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns True if there are trees to the _left_ of the focus.
 * @category zipper
 * @function
 */
export const hasLefts = <A>({lefts}: Zipper<A>): boolean => lefts.length > 0

/**
 * True if there are trees to the _right_ of the focus, false if focused node is
 * last in its forest.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2), of(3))
 *
 * const zipper = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head
 * )
 *
 * expect(Zipper.hasRights(zipper)).toBe(true)
 *
 * const moved = Zipper.next(zipper)
 *
 * expect(Zipper.hasRights(moved)).toBe(false)
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns True if there are trees to the _right_ of the focus.
 * @category zipper
 * @function
 */
export const hasRights = <A>({rights}: Zipper<A>): boolean => rights.length > 0

/**
 * Get the nodes to the left of the focus node.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2), of(3))
 *
 * const zipper = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head
 * )
 *
 * expect(Zipper.getLefts(zipper)).toEqual([])
 *
 * const moved = Zipper.next(zipper)
 *
 * expect(Zipper.getLefts(moved)).toEqual([of(2)])
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns Possibly empty list of trees.
 * @category zipper
 * @function
 */
export const getLefts = <A>({lefts}: Zipper<A>): Tree.Tree<A>[] => lefts

/**
 * Get the nodes to the left of the focus node.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2), of(3))
 *
 * const zipper = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head
 * )
 *
 * expect(Zipper.getRights(zipper)).toEqual([of(3)])
 *
 * const moved = Zipper.next(zipper)
 *
 * expect(Zipper.getRights(moved)).toEqual([])
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns Possibly empty list of trees.
 * @category zipper
 * @function
 */
export const getRights = <A>({rights}: Zipper<A>): Tree.Tree<A>[] => rights

/**
 * Get the depth of the zipper, where a zipper focused on the root node gets a
 * depth of `0`.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 *
 * const tree = from(1, of(2), of(3))
 *
 * const zipper = Zipper.fromTree(tree)
 *
 * expect(Zipper.getDepth(zipper)).toBe(0)
 *
 * const moved = Zipper.head(zipper)
 *
 * expect(Zipper.getDepth(moved)).toBe(1)
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns Integer depth of the zipper.
 * @category zipper
 * @function
 */
export const getDepth = <A>({levels}: Zipper<A>): number => levels.length

/**
 * True if the zipper is currently focused on the tree root node.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 *
 * const tree = from(1, of(2), of(3))
 *
 * const zipper = Zipper.fromTree(tree)
 *
 * expect(Zipper.isRoot(zipper)).toBe(true)
 *
 * const moved = Zipper.head(zipper)
 *
 * expect(Zipper.isRoot(moved)).toBe(false)
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns True if zipper is at root else false.
 * @category zipper
 * @function
 */
export const isRoot = <A>({parent}: Zipper<A>): boolean => Option.isNone(parent)

/**
 * True if the zipper is currently focused on a leaf.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 *
 * const tree = from(1, of(2), of(3))
 *
 * const zipper = Zipper.fromTree(tree)
 *
 * expect(Zipper.isLeaf(zipper)).toBe(false)
 *
 * const moved = Zipper.head(zipper)
 *
 * expect(Zipper.isLeaf(moved)).toBe(true)
 * @typeParam A Underlying tree type.
 * @param zipper Zipper to be queried.
 * @returns True if zipper is at leaf else false.
 * @category zipper
 * @function
 */
export const isLeaf = <A>({focus}: Zipper<A>): boolean => Tree.isLeaf(focus)
