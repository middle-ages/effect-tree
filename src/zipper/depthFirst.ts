import {isNonEmptyArray} from '#Array'
import {type EndoK} from '#Function'
import {flow, Option} from 'effect'
import {isRoot} from './data.js'
import {type OptionalZipper, type ZipperTypeLambda} from './index.js'
import {tryHead, tryNext, tryUp} from './navigate.js'

/**
 * Navigate from a node to the next node in a depth-first pre-order traversal:
 * parents are visited before their children, and both are visited before the
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
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe, Option} from 'effect'
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
 * const hop1 = Zipper.tryDepthFirst(start)
 * const value1 = pipe(hop1, Option.map(Zipper.getValue))
 * expect(value1, 'hop1').toEqual(Option.some(2))
 *
 * const hop2 = pipe(hop1, Option.flatMap(Zipper.tryDepthFirst))
 * const value2 = pipe(hop2, Option.map(Zipper.getValue))
 * expect(value2, 'hop2').toEqual(Option.some(3))
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if there is no next node in the depth-first traversal.
 * @category zipper
 * @function
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
 * where parents are visited before their children, and both are visited before
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
 * This is the unsafe version of {@link tryDepthFirst}.
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
 * const hop1 = Zipper.depthFirst(start)
 * expect(Zipper.getValue(hop1)).toBe(2)
 *
 * const hop2 = Zipper.depthFirst(hop1)
 * expect(Zipper.getValue(hop2)).toBe(3)
 *
 * const hop3 = Zipper.depthFirst(hop2)
 * expect(Zipper.getValue(hop3)).toBe(4)
 *
 * const hop4 = Zipper.depthFirst(hop3)
 * expect(Zipper.getValue(hop4)).toBe(5)
 *
 * const hop5 = Zipper.depthFirst(hop4)
 * expect(Zipper.getValue(hop5)).toBe(6)
 *
 * const hop6 = Zipper.depthFirst(hop5)
 * expect(Zipper.getValue(hop6)).toBe(7)
 *
 * // Out-of-bounds exception when nowhere left to go.
 * expect(()  => Zipper.depthFirst(hop6)).toThrow(/getOrThrow/)
 * @typeParam A The underlying type of the tree.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const depthFirst: EndoK<ZipperTypeLambda> = flow(
  tryDepthFirst,
  Option.getOrThrow,
)
