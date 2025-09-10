import {ArbitraryThemed} from '#arbitrary/PartF'
import {getThemedEquivalence} from '#test'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {describe} from 'vitest'
import {
  ThemedCovariant as Covariant,
  ThemedMonad as Monad,
} from './instances.js'
import {type ThemedTypeLambda} from './types.js'

describe('Themed typeclass laws', () => {
  testTypeclassLaws<ThemedTypeLambda>({
    getEquivalence: getThemedEquivalence,
    getArbitrary: ArbitraryThemed,
  })({Covariant, Monad}, {numRuns: 3})
})
