import {getArbitrary, type ArbitraryOptions} from '#arbitrary/Tree'
import {assertDrawTree, numericTree, testNumericTreeStackSafety} from '#test'
import {getEquivalence, map, type Tree} from '#tree'
import {flow, Number, Pair, pipe, String, Tuple} from '#util'
import {Equivalence} from 'effect'
import {Law, lawTests, tinyPositive, tinyString} from 'effect-ts-laws'
import {verboseLawSets} from 'effect-ts-laws/vitest'
import fc from 'fast-check'
import {describe, test} from 'vitest'
import {asOrdinal} from './ordinal.js'
import {unzip, zip} from './zip.js'

const formatPair: (pair: [number, number]) => string = flow(
  Pair.pairMap(String.fromNumber),
  String.unwords.comma,
)

describe('zip', () => {
  test('basic', () => {
    const actual = pipe(numericTree, zip(numericTree), map(formatPair))

    assertDrawTree(`
┬1, 1
├┬2, 2
│├─3, 3
│├─4, 4
│└─5, 5
├┬6, 6
│├─7, 7
│├─8, 8
│└┬11, 11
│ └─9, 9
└─10, 10`)(actual)
  })
})

describe('laws', () => {
  const options: Partial<ArbitraryOptions> = {
    branchBias: 1 / 4,
    maxChildren: 4,
    maxDepth: 3,
  }

  const congruentPair = getArbitrary(tinyString, options).chain(stringTree =>
    fc.tuple(
      fc.constant(stringTree),
      pipe(stringTree, asOrdinal(1), fc.constant),
    ),
  )

  const congruentPairEquals: Equivalence.Equivalence<
    [Tree<string>, Tree<number>]
  > = Tuple.getEquivalence(
    getEquivalence(String.Equivalence),
    getEquivalence(Number.Equivalence),
  )

  const treeOfPair: fc.Arbitrary<Tree<[string, number]>> = getArbitrary(
    fc.tuple(tinyString, tinyPositive),
    options,
  )

  const treeOfPairEquals: Equivalence.Equivalence<Tree<[string, number]>> =
    getEquivalence(
      Tuple.getEquivalence.removeReadOnly(
        String.Equivalence,
        Number.Equivalence,
      ),
    )

  verboseLawSets(
    [
      lawTests(
        'zip/unzip laws',
        Law(
          'zip/unzip cancellation',
          '∀a ∈ Tree<A>, ∀b ∈ Tree<B>: a ≅ b ⇒ zip(a,b) ▹ unzip = [a, b]',
          congruentPair,
        )(pair => congruentPairEquals(pipe(zip(...pair), unzip), pair)),

        Law(
          'unzip/zip cancellation',
          '∀t ∈ Tree<[A,B]>: zip ⚬ unzip = Id',
          treeOfPair,
        )(tree => treeOfPairEquals(zip(...unzip(tree)), tree)),
      ),
    ],
    {numRuns: 20},
  )
})

testNumericTreeStackSafety('stack safety', self => unzip(zip(self, self)))
