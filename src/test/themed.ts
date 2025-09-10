import {ArbitraryTheme} from '#arbitrary/PartF'
import {type Themed} from '#draw'
import type {Equivalence as EQ} from 'effect'
import {testUnaryEquivalence} from 'effect-ts-laws'

/**
 * Sampling equivalence for `Themed<A>`.
 */
export const getThemedEquivalence = <A>(
  equalsA: EQ.Equivalence<A>,
): EQ.Equivalence<Themed<A>> => testUnaryEquivalence(ArbitraryTheme, equalsA)
