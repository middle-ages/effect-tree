import {isNonEmptyArray} from '#util/Array'
import {type EndoK} from '#util/Function'
import {flow, Option} from 'effect'
import {isRoot} from './data.js'
import {type OptionalZipper, type ZipperTypeLambda} from './index.js'
import {tryHead, tryNext, tryUp} from './navigate.js'

/**
 * Navigate from a node to the next node in a depth-first pre-order traversal:
 * parents are visited before their children, and both are visited  before the
 * next sibling of the parent. For example:
 *
 * ```txt
 * For the tree:
 *                   ┌─┐
 *                   │1│
 *              ╭────┴─┴─────╮
 *            ┌─┴─┐        ┌─┴─┐
 *            │1.1│        │1.2│
 *          ╭─┴───┴╮      ╭┴───┴─╮
 *       ┌──┴──┐┌──┴──┐┌──┴──┐┌──┴──┐
 *       │1.1.1││1.1.2││1.2.1││1.2.2│
 *       └─────┘└─────┘└─────┘└─────┘
 *
 *     tryDepthFirst ┊ result of
 *       called on...┊ navigation
 *     ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┼┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
 *              “1”  ┊ some(“1.1”)
 *            “1.1”  ┊ some(“1.2”)
 *          “1.1.1”  ┊ some(“1.1.2”)
 *          “1.1.2”  ┊ some(“1.2”)
 *            “1.2”  ┊ some(“1.2.1”)
 *          “1.2.1”  ┊ some(“1.2.2”)
 *          “1.2.2”  ┊ none()
 * ```
 *
 * Returns `Option.none` when the final node in the traversal has been reached.
 *
 * See {@link depthFirst} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if there is no next node in the depth-first traversal.
 * @category zipper
 */
export const tryDepthFirst: OptionalZipper = self => {
  const head = tryHead(self)
  if (Option.isSome(head)) {
    return head
  } else if (isNonEmptyArray(self.rights)) {
    return tryNext(self)
  } else if (isRoot(self)) {
    return Option.none()
  }

  let nextLevel = tryUp(self)
  while (Option.isSome(nextLevel)) {
    const level = nextLevel.value
    if (isNonEmptyArray(level.rights)) {
      return tryNext(level)
    }
    nextLevel = Option.flatMap(nextLevel, tryUp)
  }

  // We have reached the final node of the pre-order depth-first search.
  return Option.none()
}

/**
 * Navigate from a node to the next node in a depth-first pre-order traversal,
 * where parents are visited before their children, and both are visited  before
 * the next sibling of the parent. For example:
 *
 * ```txt
 * For the tree:
 *                   ┌─┐
 *                   │1│
 *              ╭────┴─┴─────╮
 *            ┌─┴─┐        ┌─┴─┐
 *            │1.1│        │1.2│
 *          ╭─┴───┴╮      ╭┴───┴─╮
 *       ┌──┴──┐┌──┴──┐┌──┴──┐┌──┴──┐
 *       │1.1.1││1.1.2││1.2.1││1.2.2│
 *       └─────┘└─────┘└─────┘└─────┘
 *
 *      depthFirst ┊ result of
 *     called on...┊ navigation
 *     ┈┈┈┈┈┈┈┈┈┈┈┈┼┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
 *            “1”  ┊ “1.1”
 *          “1.1”  ┊ “1.2”
 *          “1.2”  ┊ “1.1.1”
 *        “1.1.1”  ┊ “1.1.2”
 *        “1.2.1”  ┊ “1.2.2”
 *        “1.2.2”  ┊ Exception thrown
 * ```
 *
 * Returns `Option.none` when the final node in the traversal has been reached.
 *
 * This is the unsafe version of  {@link tryDepthFirst}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 */
export const depthFirst: EndoK<ZipperTypeLambda> = flow(
  tryDepthFirst,
  Option.getOrThrow,
)
