import {Tree} from '#arbitrary'
import type {TreeTypeLambda} from '#tree'
import {monoEquivalence, monoOrder} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe} from 'vitest'
import {Applicative} from './Applicative.js'
import {Covariant, PreOrderCovariant} from './Covariant.js'
import {getEquivalence} from './Equivalence.js'
import {Foldable} from './Foldable.js'
import {Monad} from './Monad.js'
import {getOrder} from './Order.js'
import {PreOrderTraversable, Traversable} from './Traversable.js'
import type fc from 'fast-check'

describe('Tree typeclass laws', () => {
  const common = {
    getEquivalence,
    getArbitrary: <A>(a: fc.Arbitrary<A>) =>
      Tree.getArbitrary(a, {maxChildren: 2, maxDepth: 2}),
  }

  testTypeclassLaws<TreeTypeLambda>(common)({
    Applicative,
    Covariant,
    Equivalence: getEquivalence(monoEquivalence),
    Order: getOrder(monoOrder),
    Foldable,
    Monad,
    Traversable,
  })

  describe('pre-order Covariant & Traversable', () => {
    testTypeclassLaws<TreeTypeLambda>(common)({
      Covariant: PreOrderCovariant,
      Traversable: PreOrderTraversable,
    })
  })
})
