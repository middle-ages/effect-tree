import {unwords} from '#String'
import {Array, Equivalence as EQ, String} from 'effect'
import {
  VStruts,
  type HStrut,
  type HStruts,
  type Struts,
  type VStrut,
} from './index.js'

const arrayStringEquivalence = Array.getEquivalence(String.Equivalence)

/**
 * Equivalence for horizontal struts.
 * @category drawing
 * @function
 */
export const HStrutEquivalence: EQ.Equivalence<HStrut> = EQ.struct({
  prefix: String.Equivalence,
  body: arrayStringEquivalence,
  suffix: String.Equivalence,
})

/**
 * Equivalence for vertical struts.
 * @category drawing
 * @function
 */
export const VStrutEquivalence: EQ.Equivalence<VStrut> = EQ.struct({
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
