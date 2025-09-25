import * as Tree from '#tree'
import {append, isNonEmptyArray, type NonEmptyArray} from '#Array'
import {K} from '#Function'
import {HKT, Option, pipe, Struct} from 'effect'

/**
 * A zipper encodes a location with a tree, allowing for efficient navigation
 * @typeParam A The underlying type of the tree.
 * and update of immutable trees.
 * @category zipper
 */
export interface Zipper<A> extends ZipperLevel<A> {
  /** Tree node that is the current focus. */
  focus: Tree.Tree<A>
  /**
   * Everything required to rebuild all levels of the tree _above_ this one.
   * At the root level of a tree this array will be empty, when focused
   * on any of the children of the root node it will hold a single level,
   * and so on. The number of levels found is the depth of the zipper.
   */
  levels: ZipperLevel<A>[]
}

/**
 * Everything required to rebuild a level of the tree and all below it.
 * To recreate the level we add the focus node between the `lefts` and the
 * `rights` then add this forest to the parent value to get a tree.
 * @typeParam A The underlying type of the tree.
 * @category zipper
 */
export interface ZipperLevel<A> {
  /** All children of the parent that are _to the left_ of the focus node. */
  lefts: Tree.Tree<A>[]
  /** All children of the parent that are _to the right_ of the focus node. */
  rights: Tree.Tree<A>[]
  /**
   * Parent node _value_ of the focus node at the level we are encoding. All
   * nodes have a parent except the root node.
   */
  parent: Option.Option<A>
}

/**
 * Create a new zipper focused on the root node of the given tree.
 * @typeParam A The underlying type of the tree.
 * @param focus The tree at the focus of the new zipper.
 * @returns A new zipper focused on the given tree root node.
 * @category zipper
 */
export const fromTree = <A>(focus: Tree.Tree<A>): Zipper<A> => ({
  focus,
  levels: [],
  lefts: [],
  rights: [],
  parent: Option.none(),
})

/**
 * Convert a zipper back into a tree.
 * @typeParam A The underlying type of the tree.
 * @param zipper The zipper that will be converted into a tree.
 * @returns The tree encoded by the zipper.
 * @category zipper
 * @function
 */
export const toTree = <A>(zipper: Zipper<A>): Tree.Tree<A> => {
  const {focus, levels} = zipper
  const bottom: Tree.Tree<A> = fromLevel(focus, zipper)

  if (!isNonEmptyArray(levels)) {
    return bottom
  }

  let current: Tree.Tree<A> = bottom
  for (let i = levels.length; i--; i >= 0) {
    current = fromLevel(current, levels[i] as ZipperLevel<A>)
  }

  return current
}

/**
 * Type lambda for the `Zipper<A>` type.
 * `Kind<ZipperTypeLambda, never, unknown, unknown, A> ≡ Zipper<A>`
 * @category zipper
 */
export interface ZipperTypeLambda extends HKT.TypeLambda {
  readonly type: Zipper<this['Target']>
}

/**
 * Type lambda for the `ZipperLevel<A>` type.
 * `Kind<ZipperLevelTypeLambda, never, unknown, unknown, A> ≡ ZipperLevel<A>`
 * @category zipper
 */
export interface ZipperLevelTypeLambda extends HKT.TypeLambda {
  readonly type: ZipperLevel<this['Target']>
}

/**
 * Type of function that takes a zipper and returns an option of a zipper.
 * See {@link OptionalZipperOf} for a version that fixes the type parameter.
 * @category zipper
 */
export interface OptionalZipper {
  <A>(zipper: Zipper<A>): Option.Option<Zipper<A>>
}

/**
 * Just like {@link OptionalZipper} except the type parameter `A` is fixed.
 * @category zipper
 */
export interface OptionalZipperOf<A> {
  (zipper: Zipper<A>): Option.Option<Zipper<A>>
}

/**
 * Extract the underlying type `A` of the zipper.
 * @category zipper
 */
export type ZipperType<Z extends Zipper<any>> =
  Z extends Zipper<infer A> ? A : never

/**
 * Push the zipper itself into its own level stack.
 * Helpful when navigating _down_.
 * @category internal
 */
export function pushSelf<A>(zipper: Zipper<A>): {
  levels: NonEmptyArray<ZipperLevel<A>>
  parent: Option.Option<A>
} {
  return {
    parent: pipe(zipper.focus, Tree.getValue, Option.some),
    levels: append(
      zipper.levels,
      Struct.pick(zipper, 'lefts', 'rights', 'parent'),
    ),
  }
}

/**
 * Rebuild a level of the tree.
 * @category internal
 */
export function fromLevel<A>(
  focus: Tree.Tree<A>,
  {lefts, rights, parent}: ZipperLevel<A>,
): Tree.Tree<A> {
  return Option.match(parent, {
    onNone: K(focus),
    onSome: parent => Tree.tree(parent, [...lefts, focus, ...rights]),
  })
}
