import {pipe} from '#util'
import {type NonEmptyArray} from '#util/Array'
import {filterDefined} from '#util/Record'
import {
  stringWidth,
  segmentSlice,
  fillColumns,
  fillRows,
  unwords,
} from '#util/String'
import type {Axis, AxisDirected, AxisString} from '../direction.js'

/**
 * @category drawing
 */
export type HStrut = BaseStrut<'horizontal'>

/**
 * @category drawing
 */
export type VStrut = BaseStrut<'vertical'>

/**
 * @category drawing
 */
export interface BaseStrut<A extends Axis> {
  axis: A
  body: NonEmptyArray<string>
  prefix: AxisString<A>
  suffix: AxisString<A>
}

/**
 * A type that has a horizontal strut defined.
 * @category drawing
 */
export interface HasHStrut {
  hStrut: HStrut
}

/**
 * A type that has a vertical strut defined.
 * @category drawing
 */
export interface HasVStrut {
  vStrut: VStrut
}

/**
 * A type that has a vertical strut defined.
 * @category drawing
 */
export type Strut = HStrut | VStrut

/**
 * @category drawing
 */
export interface AreaStruts extends HasVStrut, HasHStrut {}

/**
 * Type of a pair of horizontal and vertical struts placed at the four
 * directions.
 * @category drawing
 */
export type AxisStruts = AxisDirected<HStrut, VStrut>

/**
 * Type guard for horizontal struts.
 * @category drawing
 */
export const isHStrut = (strut: BaseStrut<Axis>): strut is HStrut =>
  strut.axis === 'horizontal'

/**
 * Type guard for vertical struts.
 * @category drawing
 */
export const isVStrut = (strut: BaseStrut<Axis>): strut is VStrut =>
  strut.axis === 'vertical'

/**
 * @category drawing
 */
export const HStrut = (
  body: NonEmptyArray<string> = [' '],
  prefix = '',
  suffix = '',
): HStrut => ({
  axis: 'horizontal',
  prefix,
  body,
  suffix,
})

/**
 * @category drawing
 */
export const VStrut = (
  body: NonEmptyArray<string> = [''],
  prefix: string[] = [],
  suffix: string[] = [],
): VStrut => ({
  axis: 'vertical',
  prefix,
  body,
  suffix,
})

VStrut.empty = VStrut([''])
HStrut.space = HStrut([' '])

export const defaultHStrut: HStrut = HStrut.space
export const defaultVStrut: VStrut = VStrut.empty

const defaultPartStruts: AxisStruts = {
  top: defaultVStrut,
  right: defaultHStrut,
  bottom: defaultVStrut,
  left: defaultHStrut,
}

/**
 * Upgrade a partial set of struts per direction into a total one.
 * @category drawing
 */
export const normalizeAxisStruts = (
  struts?: Partial<AxisStruts>,
): AxisStruts => ({
  ...defaultPartStruts,
  ...(filterDefined(struts ?? {}) as AxisStruts),
})

/**
 * Upgrade a partial set of struts per axis into a total one.
 * @category drawing
 */
export const normalizeAreaStruts = (
  struts?: Partial<AreaStruts>,
): AreaStruts => ({
  hStrut: struts?.hStrut ?? defaultHStrut,
  vStrut: struts?.vStrut ?? defaultVStrut,
})

HStrut.fill =
  ({prefix, body, suffix}: HStrut) =>
  (available: number): string => {
    if (available === 0) {
      return ''
    }

    const forBody = available - stringWidth(prefix) - stringWidth(suffix)
    if (forBody >= 0) {
      return prefix + pipe(body, unwords, fillColumns(forBody)) + suffix
    }

    const forSuffix = Math.floor(available / 2)
    const forPrefix = available - forSuffix
    return unwords([
      ...segmentSlice(0, forPrefix)(prefix),
      ...segmentSlice(0, forSuffix)(suffix),
    ])
  }

VStrut.fill =
  ({prefix, body, suffix}: VStrut) =>
  (available: number): string[] => {
    if (available === 0) {
      return []
    }

    const forBody = available - prefix.length - suffix.length
    if (forBody >= 0) {
      return [...prefix, ...fillRows(forBody)(body), ...suffix]
    }

    const forSuffix = Math.floor(available / 2)
    const forPrefix = available - forSuffix
    return [...prefix.slice(0, forPrefix), ...suffix.slice(0, forSuffix)]
  }
