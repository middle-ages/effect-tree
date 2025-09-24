import type {NonEmptyArray2} from '#util/Array'
import {Array, Equivalence, Predicate, pipe} from 'effect'

/**
 * Check that a path list is valid:
 *
 * 1. Every leaf, I.e.: a node that appears last in its path, is mentioned in
 *    only one path.
 * 2. All paths share the same root
 * 3. For any pair of appearances of any node the parent node is equal.
 * @category codec
 * @function
 */
export const isValidPathList =
  <A>(
    equals: Equivalence.Equivalence<A>,
  ): Predicate.Predicate<NonEmptyArray2<A>> =>
  paths => {
    const parents = new Map<A, A>(),
      leaves = new Set<A>(),
      root = paths[0][0]

    for (const path of paths) {
      const [head, leaf] = [Array.headNonEmpty(path), Array.lastNonEmpty(path)]

      if (!equals(head, root) || leaves.has(leaf)) return false
      leaves.add(leaf)

      const zipped = pipe(
        Array.tailNonEmpty(path),
        Array.zip(Array.initNonEmpty(path)),
      )
      if (Array.isEmptyArray(zipped)) return paths.length === 1

      for (const [child, parent] of zipped) {
        const maybeParent = parents.get(child)
        if (maybeParent === undefined) parents.set(child, parent)
        else if (!equals(maybeParent, parent)) return false
      }
    }

    return true
  }
