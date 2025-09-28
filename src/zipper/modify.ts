import {isNonEmptyArray, lastInit} from '#Array'
import {dual, type EndoOf} from '#Function'
import * as Tree from '#tree'
import {Option} from 'effect'
import {hasRights} from './data.js'
import {type OptionalZipper, type Zipper} from './index.js'
import {head, last, next} from './navigate.js'

/**
 * Replace the focus tree node of the zipper with the given tree node.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2))
 *
 * const changed = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head,
 *   Zipper.replace(from(3, of(4))),
 *   Zipper.toTree,
 * )
 *
 * expect(changed).toEqual(from(1, from(3, of(4))))
 * @typeParam A The underlying type of the tree.
 * @returns A function that takes a zipper and returns an updated zipper where the focus node has been replaced.
 * @category zipper
 * @function
 */
export const replace: {
  <A>(zipper: Zipper<A>, newNode: Tree.Tree<A>): Zipper<A>
  <A>(newNode: Tree.Tree<A>): (zipper: Zipper<A>) => Zipper<A>
} = dual(
  2,
  <A>({focus: _, ...rest}: Zipper<A>, newNode: Tree.Tree<A>): Zipper<A> => ({
    ...rest,
    focus: newNode,
  }),
)

const _prepend = <A>(
  {focus, ...rest}: Zipper<A>,
  newNode: Tree.Tree<A>,
): Zipper<A> => ({
  ...rest,
  focus: Tree.prepend(focus, newNode),
})

const _append = <A>(
  {focus, ...rest}: Zipper<A>,
  newNode: Tree.Tree<A>,
): Zipper<A> => ({
  ...rest,
  focus: Tree.append(focus, newNode),
})

/**
 * Insert the given node as the first child of the given focus.
 *
 * At the key `move` you will find a version that moves the focus to the newly
 * inserted node.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2))
 *
 * const changed = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.prepend(of(1.5)),
 *   Zipper.toTree,
 * )
 *
 * expect(changed, 'changed').toEqual(from(1, of(1.5), of(2)))
 *
 * // This time we move to the newly inserted tree
 * const moved = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.prepend.move(of(1.5)),
 * )
 *
 * expect(Zipper.getValue(moved), 'moved').toBe(1.5)
 * @typeParam A The underlying type of the tree.
 * @returns A function that takes a zipper and returns an updated zipper where the focus node has been replaced.
 * @category zipper
 * @function
 */
export const prepend: {
  <A>(self: Zipper<A>, newNode: Tree.Tree<A>): Zipper<A>
  <A>(newNode: Tree.Tree<A>): (self: Zipper<A>) => Zipper<A>
  move: <A>(newNode: Tree.Tree<A>) => EndoOf<Zipper<A>>
} = Object.assign(dual(2, _prepend), {
  move:
    <A>(newNode: Tree.Tree<A>): EndoOf<Zipper<A>> =>
    self =>
      head(_prepend(self, newNode)),
})

/**
 * Append the given node as the last child of the given focus.
 *
 * At the key `move` you will find a version where the focus has been _moved_ to
 * the newly appended node.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const tree = from(1, of(2))
 *
 * const changed = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.append(of(3)),
 *   Zipper.toTree,
 * )
 *
 * expect(changed, 'changed').toEqual(from(1, of(2), of(3)))
 *
 * // This time we move to the newly appended tree
 * const moved = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.append.move(of(3)),
 * )
 *
 * expect(Zipper.getValue(moved), 'moved').toBe(3)
 * @typeParam A The underlying type of the tree.
 * @returns A function that takes a zipper and returns an updated zipper where the focus node has been replaced.
 * @category zipper
 * @function
 */
export const append: {
  <A>(self: Zipper<A>, newNode: Tree.Tree<A>): Zipper<A>
  <A>(newNode: Tree.Tree<A>): (self: Zipper<A>) => Zipper<A>
  move: <A>(newNode: Tree.Tree<A>) => EndoOf<Zipper<A>>
} = Object.assign(dual(2, _append), {
  move:
    <A>(newNode: Tree.Tree<A>): EndoOf<Zipper<A>> =>
    self =>
      last(_append(self, newNode)),
})

/**
 * Remove the current focused tree node from the tree, and return the zipper
 * focused on the _next_ sibling.
 *
 * When no next sibling exists, for example if the node is the last in the
 * forest, focuses _up_ on the parent of the removed node.
 *
 * When the zipper is focused on tree root returns `Option.none()`.
 * @example
 * import {Zipper, from, of} from 'effect-tree'
 * import {Option, pipe} from 'effect'
 *
 * const tree = from(1, of(2))
 *
 * const changed = pipe(
 *   tree,
 *   Zipper.fromTree,
 *   Zipper.head,
 *   Zipper.remove,
 *   Option.map(Zipper.toTree),
 * )
 * expect(changed, 'leaf').toEqual(Option.some(of(1)))
 *
 * const removeRoot = pipe(
 *   changed,
 *   Option.map(Zipper.fromTree),
 *   Option.flatMap(Zipper.remove),
 * )
 * expect(removeRoot, 'root').toEqual(Option.none())
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
