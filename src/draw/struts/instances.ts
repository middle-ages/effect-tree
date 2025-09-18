import {Array, Equivalence as EQ, String} from 'effect'
import {unwords} from '../../util/String.js'
import type {Axis} from '../direction.js'
import {
  isHStrut,
  isVStrut,
  type BaseStrut,
  type HStrut,
  type Strut,
  type VStrut,
} from './index.js'

const arrayStringEquivalence = Array.getEquivalence(String.Equivalence)

/**
 * An [Equivalence](https://effect-ts.github.io/effect/effect/Equivalence.ts.html)
 * for values of the {@link BaseStrut} type.
 * @category drawing
 * @category instances
 */
export const StrutEquivalence: EQ.Equivalence<BaseStrut<Axis>> = (
  self: BaseStrut<Axis>,
  that: BaseStrut<Axis>,
) =>
  isHStrut(self) && isHStrut(that)
    ? hStrutEquivalence(self, that)
    : isVStrut(self) && isVStrut(that)
      ? vStrutEquivalence(self, that)
      : false

const hStrutEquivalence: EQ.Equivalence<HStrut> = EQ.struct({
  prefix: String.Equivalence,
  body: arrayStringEquivalence,
  suffix: String.Equivalence,
})

const vStrutEquivalence: EQ.Equivalence<VStrut> = EQ.struct({
  prefix: arrayStringEquivalence,
  body: arrayStringEquivalence,
  suffix: arrayStringEquivalence,
})

/**
 * @category drawing
 */
export const showHStrut = ({prefix, body, suffix}: HStrut): string =>
  `⊦${prefix}«${unwords.quote.fancy(body)}»${suffix}`

/**
 * @category drawing
 */
export const showVStrut = ({prefix, body, suffix}: VStrut): string =>
  unwords.rest(
    '⊥',
    unwords.comma(prefix),
    `«${unwords.quote.fancy(body)}»`,
    unwords.comma(suffix),
  )

/**
 * @category drawing
 */
export const showStrut = (strut: Strut): string =>
  isHStrut(strut) ? showHStrut(strut) : showVStrut(strut)
