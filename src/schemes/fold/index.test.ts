import {descendantCountFold, zip as zipTrees} from '#ops'
import {bracketFold} from '#test'
import {
  annotateFolder,
  from,
  getEquivalence,
  of,
  replaceFolder,
  treeCata,
  type Tree,
} from '#tree'
import {Number, pipe, Tuple} from 'effect'
import {Law, lawTests, tinyPositive} from 'effect-ts-laws'
import {verboseLawSets} from 'effect-ts-laws/vitest'
import {describe, expect, test} from 'vitest'
import * as Arbitrary from '#arbitrary'

describe('fold', () => {
  // tree = ┬A ⇒ A(B,C(D,E),F)
  //        ├─B
  //        ├┬C
  //        │├─D
  //        │└─E
  //        └─F
  //
  const tree = from('A', of('B'), from('C', of('D'), of('E')), of('F'))

  test('treeCata', () => {
    expect(pipe(tree, treeCata(bracketFold))).toBe('A(B, C(D, E), F)')
  })

  describe('laws', () => {
    {
      const a = Arbitrary.Tree.getArbitrary(tinyPositive),
        equals = getEquivalence<[number, number]>(
          Tuple.getEquivalence(Number.Equivalence, Number.Equivalence),
        ),
        φ = descendantCountFold

      verboseLawSets([
        lawTests(
          'annotate replace law',
          Law(
            'replace/annotate consistency',
            'a ▹ cata(annotate(φ)) = zip(a, a ▹ cata(replace(φ)))',
            a,
          )(a => {
            const left: Tree<[number, number]> = pipe(
              a,
              pipe(φ, annotateFolder<number, number>, treeCata),
            )

            const right = zipTrees(
              a,
              pipe(a, treeCata<number, Tree<number>>(replaceFolder(φ))),
            )

            return equals(left, right)
          }),
        ),
      ])
    }
  })
})
