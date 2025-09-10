import {TreeF} from '#arbitrary'
import {Boolean, Option} from 'effect'
import {monoEquivalence, option} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import fc from 'fast-check'
import {describe} from 'vitest'
import * as instances from './instances.js'
import type {TreeFTypeLambda} from './types.js'

const [OptionEquivalence, OptionArbitrary] = [
  Option.getEquivalence(Boolean.Equivalence),
  option(fc.boolean()),
]

const getEquivalence = instances.getEquivalence(OptionEquivalence)

describe('TreeF typeclass laws', () => {
  testTypeclassLaws<TreeFTypeLambda, never, unknown, Option.Option<boolean>>({
    getEquivalence,
    getArbitrary: TreeF.getArbitrary(OptionArbitrary),
  })(
    {
      Covariant: instances.Covariant,
      Equivalence: getEquivalence(monoEquivalence),
      FlatMap: instances.FlatMap,
      Traversable: instances.Traversable,
    },
    {numRuns: 20},
  )
})
