import {describe, expect, test} from 'vitest'
import {bottomSubtrees, nodeCount} from '#ops'
import {numericTree} from '#test'
import {branch, of} from '#tree'
import {Tree} from '#arbitrary'
import {Array, pipe} from 'effect'
import {Law, lawTests, tinyPositive} from 'effect-ts-laws'
import {verboseLawSets} from 'effect-ts-laws/vitest'

describe('subtrees', () => {
  describe('bottomSubtrees', () => {
    test('leaf', () => {
      expect(bottomSubtrees(of(1))).toEqual([of(1)])
    })

    test('branch', () => {
      const tree = branch('root', [
        branch('a', [of('b'), of('c')]),
        branch('d', [of('e'), of('f')]),
      ])

      expect(bottomSubtrees(tree)).toEqual([
        of('b'),
        of('c'),
        branch('a', [of('b'), of('c')]),
        of('e'),
        of('f'),
        branch('d', [of('e'), of('f')]),
        tree,
      ])
    })

    test('numericTree', () => {
      expect(bottomSubtrees(numericTree)).toEqual([
        of(3),
        of(4),
        of(5),
        branch(2, [of(3), of(4), of(5)]),

        of(7),
        of(8),
        of(9),
        branch(11, [of(9)]),

        branch(6, [of(7), of(8), branch(11, [of(9)])]),

        of(10),

        numericTree,
      ])
    })
  })
  {
    const a = Tree.getArbitrary(tinyPositive)

    verboseLawSets([
      lawTests(
        'laws',
        Law(
          'bottom-grounded subtree count is node count',
          '∀tree ∈ Tree<_>: #bottomSubtrees(tree) = nodeCount(tree)',
          a,
        )(a => bottomSubtrees(a).length === nodeCount(a)),

        Law(
          'bottom-grounded subtrees are smaller',
          '∀tree ∈ Tree<_>: tree ▹ bottomSubtrees ▹ nodeCount <= tree ▹ nodeCount',
          a,
        )(a =>
          pipe(
            a,
            bottomSubtrees<number>,
            Array.every(subtree => nodeCount(subtree) <= nodeCount(a)),
          ),
        ),
      ),
    ])
  }
})
