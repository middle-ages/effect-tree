import {filterMinimumLeaf} from '#ops'
import {getBranchForest, isLeaf, type Branch, type Tree} from '#tree'
import {Array, Order, pipe} from '#util'
import {Effect, Option} from 'effect'

/**
 * Convert a tree with an order to its prüfer code.
 *
 * Tree requirements:
 *
 * 1. It is a branch and not a leaf. I.E: at least _two_ nodes.
 * 2. Root node value is minimum of all tree values. For example a tree of
 *    naturals should have the number `1` as its root node.
 *
 * We call `filterMinLeaf` and get back:
 *
 * 1. Our tree with its minimal leaf removed
 * 2. The parent of this removed leaf, or `none` if root
 *
 * If the node has a parent, we add it to the left of the accumulated prüfer
 * code array and recurse again on the now smaller tree.
 *
 * When a node has no parent, we stop the recursion.
 */
export const encode =
  <A>(order: Order.Order<A>): ((self: Branch<A>) => A[]) =>
  self => {
    //    console.log('encode')
    //    console.log(JSON.stringify(self, undefined, 2))
    const [head, ...rest] = getBranchForest(self)

    // Return empty array if we are encoding branch(1, leaf(2))
    if (rest.length === 0 && isLeaf(head)) {
      return []
    }

    const filter = filterMinimumLeaf(order)

    const run = (tree: Tree<A>): Effect.Effect<A[]> => {
      const [filtered, , maybeParent] = filter(tree)

      return pipe(
        maybeParent,
        Option.match({
          onNone: () => Effect.succeed([]),
          onSome: parent =>
            pipe(
              Effect.suspend(() => run(filtered)),
              Effect.map(Array.prepend(parent)),
            ),
        }),
      )
    }

    return pipe(
      pipe(self, run, Effect.runSync) as Array.NonEmptyArray<A>,
      Array.initNonEmpty, // Remove root node
    )
  }
