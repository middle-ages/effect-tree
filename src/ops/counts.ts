import {
  treeCata,
  treeCataEffect,
  type Tree,
  type TreeEffectFolderOf,
  type TreeFold,
  type TreeFolder,
  type TreeFolderOf,
  type TreeFoldOf,
} from '#tree'
import * as TreeF from '#treeF'
import {Effect, Number, pipe, Predicate} from 'effect'
import {constFalse, constTrue} from 'effect/Function'

/**
 * Compute how many nodes in a tree satisfy the given `predicate`.
 * @example
 * import {tree, from, of, countOf} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const actual = pipe(
 *   [of(2), from(3, of(4), of(5)), of(6)],
 *   tree.flipped(1),
 *   countOf(n => n % 2 === 0),
 * )
 *
 * expect(actual).toBe(3)
 * @category ops
 * @function
 */
export const countOf = <A>(
  predicate: Predicate.Predicate<A>,
): TreeFold<A, number> => pipe(predicate, countOfFold, treeCata)

/**
 * Count total node count at level.
 * @category fold
 * @function
 */
export const descendantCountFold: TreeFolderOf<number> = TreeF.match({
  onLeaf: () => 1,
  onBranch: (_, forest) => Number.sumAll(forest) + 1,
})

/**
 * Measure max node height from its deepest descendant at tree level.
 * @category fold
 * @function
 */
export const maximumHeightFold: TreeFolderOf<number> = TreeF.match({
  onLeaf: () => 1,
  onBranch: (_, forest) => Math.max(...forest) + 1,
})

/**
 * Measure max node degree at a tree level.
 * @category fold
 * @function
 */
export const maximumDegreeFold: TreeFolderOf<number> = TreeF.match({
  onLeaf: () => 0,
  onBranch: (_, forest) => Math.max(forest.length, ...forest),
})

/**
 * Measure node degree at a tree level.
 * @category fold
 * @function
 */
export const degreeFold: TreeFolderOf<number> = TreeF.length

/**
 * Count tree nodes of a tree level that satisfy the given predicate.
 * @category fold
 * @function
 */
export const countOfFold = <A>(
  predicate: Predicate.Predicate<A>,
): TreeFolder<A, number> =>
  TreeF.match({
    onLeaf: value => (predicate(value) ? 1 : 0),
    onBranch: (value, forest) =>
      (predicate(value) ? 1 : 0) + Number.sumAll(forest),
  })

/**
 * Count all nodes that are descendants of the root node and the root node
 * itself.
 * @example
 * import {tree, from, of, nodeCount} from 'effect-tree'
 * import {pipe} from 'effect'
 *
 * const actual = pipe(
 *   [of(2), from(3, of(4), of(5)), of(6)],
 *   tree.flipped(1),
 *   nodeCount
 * )
 *
 * expect(actual).toBe(6)
 * @category ops
 * @function
 */
export const nodeCount: TreeFoldOf<number> = self =>
  pipe(self, treeCata(descendantCountFold))

/**
 * Compute the maximum node depth of all nodes in a tree.
 * @example
 * import {from, of, maximumNodeHeight} from 'effect-tree'
 *
 * const tree = from(
 *   1,
 *   from(
 *     2,
 *     of(
 *       3 // ← deepest leaf
 *     )
 *   ),
 *   of(4),
 * )
 *
 * expect(maximumNodeHeight(tree)).toBe(3)
 * @category ops
 * @function
 */
export const maximumNodeHeight: TreeFoldOf<number> = self =>
  pipe(self, treeCata(maximumHeightFold))

/**
 * Compute the maximum child count of any node in the tree.
 * @example
 * import {from, of, maximumNodeDegree} from 'effect-tree'
 *
 * const tree = from(
 *   1,
 *   of(2),
 *   from(3, of(4), of(5), of(6), of(7), of(8)),
 *   from(7, of(8)),
 * )
 *
 * expect(maximumNodeDegree(tree)).toBe(5)
 * @category ops
 * @function
 */
export const maximumNodeDegree: TreeFoldOf<number> = self =>
  pipe(self, treeCata(maximumDegreeFold))

/**
 * Fails fast if node count is at least the given number.
 * @category ops
 * @function
 */
export const nodeCountAtLeastFold: (
  atLeast: number,
) => TreeEffectFolderOf<number, void> = atLeast => self => {
  const nodeCount = descendantCountFold(self)
  return nodeCount >= atLeast ? Effect.fail({}) : Effect.succeed(nodeCount)
}

/**
 * True if node count is at least the given number. Will short-circuit when
 * condition is reached rather than traverse entire tree.
 * @example
 * import {from, of, nodeCountAtLeast} from 'effect-tree'
 *
 * const leaf = of(1)
 * const tree = from(1, of(2), of(3))
 *
 * expect(nodeCountAtLeast(3)(leaf), 'leaf').toBe(false)
 * expect(nodeCountAtLeast(3)(tree), 'branch').toBe(true)
 * @category ops
 * @function
 */
export const nodeCountAtLeast =
  (atLeast: number) =>
  <A>(self: Tree<A>): boolean =>
    pipe(
      self,
      treeCataEffect(nodeCountAtLeastFold(atLeast)<A>),
      Effect.match({
        onFailure: constTrue,
        onSuccess: constFalse,
      }),
      Effect.runSync,
    )
