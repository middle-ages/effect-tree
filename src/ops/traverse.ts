/**
 * Tree depth-first traversals.
 * @packageDocumentation
 */
import type {Tree} from '#tree'
import {treeCata, type NonEmptyArrayTypeLambda, type TreeFolderK} from '#tree'
import * as TreeF from '#treeF'
import {Array, pipe} from 'effect'
import {levels} from './levels.js'

export type GetNodes = <A>(self: Tree<A>) => Array.NonEmptyArray<A>

/** Return tree nodes in breadth-first order. */
export const breadthOrderValues: GetNodes = self =>
  pipe(self, levels, Array.flatten)

/** Get all tree leaves. */
export const allLeaves: GetNodes = tree => pipe(tree, treeCata(allLeavesFold))

/**
 * Return all tree values in depth-first pre-order. Parents appear _before_
 * their children. For example:
 *
 * ```txt
 * // ┬1
 * // ├┬2
 * // │└┬3
 * // │ └─4
 * // └─5
 * const myTree = branch(
 *   1, [
 *     branch(2, [
 *       branch(3, [
 *         leaf(4),
 *       ]),
 *     ]),
 *     leaf(5),
 *   ]
 * )
 * const myValues = preOrderValues(myTree) // [1, 2, 3, 4, 5]
 * ```
 */
export const preOrderValues: GetNodes = tree =>
  pipe(tree, treeCata(preOrderFold))

/**
 * Return all tree values in depth-first post-order. Parents appear _after_
 * their children. For example:
 *
 * ```txt
 * // ┬1
 * // ├┬2
 * // │└┬3
 * // │ └─4
 * // └─5
 * const myTree = branch(
 *   1, [
 *     branch(2, [
 *       branch(3, [
 *         leaf(4),
 *       ]),
 *     ]),
 *     leaf(5),
 *   ]
 * )
 *
 * const myValues = postOrderValues(myTree) // [4, 3, 2, 5, 1]
 * ```
 */
export const postOrderValues: GetNodes = tree =>
  pipe(tree, treeCata(postOrderFold))

/**
 * Collect nodes in depth-first pre-order for a single tree level.
 * @category fold
 */
export const preOrderFold: TreeFolderK<NonEmptyArrayTypeLambda> = TreeF.match({
  onLeaf: value => [value],
  onBranch: (value, forest) =>
    pipe(forest, Array.flatten, Array.prepend(value)),
})

/**
 * Collect nodes in depth-first post-order for a single tree level.
 * @category fold
 */
export const postOrderFold: TreeFolderK<NonEmptyArrayTypeLambda> = TreeF.match({
  onLeaf: value => [value],
  onBranch: (value, forest) => pipe(forest, Array.flatten, Array.append(value)),
})

/**
 * Collect all _leaves_ from a single tree level.
 * @category fold
 */
export const allLeavesFold: TreeFolderK<NonEmptyArrayTypeLambda> = TreeF.match({
  onLeaf: value => [value],
  onBranch: (_, forest) => Array.flatten(forest),
})
