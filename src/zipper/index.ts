import * as Tree from '#tree'
import {append, isNonEmptyArray, type NonEmptyArray} from '#util/Array'
import {K} from '#util/Function'
import {HKT, Option, pipe, Struct} from 'effect'

/**
 * A zipper encodes a location with a tree, allowing for efficient navigation
 * and update of immutable trees.
 * @category ops
 */
export interface Zipper<A> extends ZipperLevel<A> {
  /** Tree node that is the current focus. */
  focus: Tree.Tree<A>
  /**
   * Everything required to rebuild all levels of the tree _above_ this one.
   */
  levels: ZipperLevel<A>[]
}

/**
 * Everything required to rebuild a level of the tree and all below it.
 * @category ops
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
 * Get the value of the tree node under focus.
 * @typeParam A - The underlying type of the tree.
 * @param zipper - Zipper to be queried.
 * @returns Value of the focus node.
 * @category ops
 */
export const value = <A>({focus}: Zipper<A>): A => Tree.getValue(focus)

/**
 * Create a new zipper focused on the root node of the given tree.
 * @typeParam A - The underlying type of the tree.
 * @param focus - The tree at the focus of the new zipper.
 * @returns A new zipper focused on the given tree root node.
 * @category ops
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
 * @typeParam A - The underlying type of the tree.
 * @param zipper - The zipper that will be converted into a tree.
 * @returns The tree encoded by the zipper.
 * @category ops
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
 * @category ops
 */
export interface ZipperTypeLambda extends HKT.TypeLambda {
  readonly type: Zipper<this['Target']>
}

/**
 * Type lambda for the `ZipperLevel<A>` type.
 * `Kind<ZipperLevelTypeLambda, never, unknown, unknown, A> ≡ ZipperLevel<A>`
 * @category ops
 */
export interface ZipperLevelTypeLambda extends HKT.TypeLambda {
  readonly type: ZipperLevel<this['Target']>
}

export interface OptionalZipper {
  <A>(zipper: Zipper<A>): Option.Option<Zipper<A>>
}

/**
 * Extract the underlying type `A` of the zipper.
 * @category ops
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
