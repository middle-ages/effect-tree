import {Array, Equivalence as EQ, String} from 'effect'
import {unwords} from '../../util/String.js'
import type {Axis} from '../direction.js'
import {
  isHStrut,
  type Struts,
  isVStrut,
  type BaseStrut,
  VStruts,
  type HStrut,
  type HStruts,
  type VStrut,
} from './index.js'

const arrayStringEquivalence = Array.getEquivalence(String.Equivalence)

/**
 * An [Equivalence](https://effect-ts.github.io/effect/effect/Equivalence.ts.html)
 * for values of the {@link BaseStrut} type.
 * @category drawing
 * @category instances
 * @function
 */
export const StrutEquivalence: EQ.Equivalence<BaseStrut<Axis>> = (
  self: BaseStrut<Axis>,
  that: BaseStrut<Axis>,
) =>
  isHStrut(self) && isHStrut(that)
    ? HStrutEquivalence(self, that)
    : isVStrut(self) && isVStrut(that)
      ? VStrutEquivalence(self, that)
      : false

const HStrutEquivalence: EQ.Equivalence<HStrut> = EQ.struct({
  prefix: String.Equivalence,
  body: arrayStringEquivalence,
  suffix: String.Equivalence,
})

const VStrutEquivalence: EQ.Equivalence<VStrut> = EQ.struct({
  prefix: arrayStringEquivalence,
  body: arrayStringEquivalence,
  suffix: arrayStringEquivalence,
})

/**
 * @category drawing
 * @function
 */
export const showHStrut = ({prefix, body, suffix}: HStrut): string =>
  `⊦${prefix}«${unwords.quote.fancy(body)}»${suffix}`

/**
 * @category drawing
 * @function
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
 * @function
 */
export const showStrut = (strut: BaseStrut<Axis>): string =>
  isHStrut(strut) ? showHStrut(strut) : isVStrut(strut) ? showVStrut(strut) : ''

/**
 * @category drawing
 * @function
 */
export const showHStruts = ({right, left}: HStruts): string =>
  unwords.rest(
    `←${showHStrut(left)}`,
    ...(HStrutEquivalence(left, right) ? [] : [`→${showHStrut(right)}`]),
  )

/**
 * @category drawing
 * @function
 */
export const showVStruts = ({top, bottom}: VStruts): string =>
  unwords.rest(
    `↑${showVStrut(top)}`,
    ...(VStrutEquivalence(top, bottom) ? [] : [`↓${showVStrut(bottom)}`]),
  )
/**
 * @category drawing
 * @function
 */
export const showStruts = ({top, right, bottom, left}: Struts): string =>
  unwords.rest(showHStruts({left, right}), showVStruts({top, bottom}))

/**
 * @category drawing
 * @function
 */
export const HStrutsEquivalence: EQ.Equivalence<HStruts> = EQ.struct({
  left: HStrutEquivalence,
  right: HStrutEquivalence,
})

/**
 * @category drawing
 * @function
 */
export const VStrutsEquivalence: EQ.Equivalence<VStruts> = EQ.struct({
  top: VStrutEquivalence,
  bottom: VStrutEquivalence,
})

/**
 * @category drawing
 * @function
 */
export const StrutsEquivalence: EQ.Equivalence<Struts> = EQ.struct({
  top: VStrutEquivalence,
  bottom: VStrutEquivalence,
  left: HStrutEquivalence,
  right: HStrutEquivalence,
})
