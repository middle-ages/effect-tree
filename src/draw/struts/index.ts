import {pipe} from '#util'
import {type NonEmptyArray} from '#util/Array'
import type {EndoOf} from '#util/Function'
import {filterDefined} from '#util/Record'
import {
  fillColumns,
  fillRows,
  segmentSlice,
  stringWidth,
  unwords,
} from '#util/String'
import type {
  Axis,
  AxisString,
  HorizontalDirection,
  VerticalDirection,
} from '../direction.js'

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
export type HStruts = Record<HorizontalDirection, HStrut>

/**
 * @category drawing
 */
export type VStruts = Record<VerticalDirection, VStrut>

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
 * A record of strut per direction: horizontal struts on the horizontal
 * directions, and vertical ones on the vertical directions.
 * @category drawing
 */
export interface Struts extends HStruts, VStruts {}

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
 * Build a horizontal strut from a non-empty array of its glyph and an
 * prefix/suffix strings.
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

/**
 * Build a pair of left/right horizontal struts form the given horizontal struts.
 * @category drawing
 */
export const HStruts = (left: HStrut, right = left): HStruts => ({
  left,
  right,
})

/**
 * Build a pair of top/bottom vertical struts form the given vertical struts.
 * @category drawing
 */
export const VStruts = (top: VStrut, bottom = top): VStruts => ({
  top,
  bottom,
})

HStrut.space = HStrut([' '])
VStrut.empty = VStrut([''])

HStruts.space = HStruts(HStrut.space)
VStruts.empty = VStruts(VStrut.empty)

export const defaultHStrut: HStrut = HStrut.space
export const defaultVStrut: VStrut = VStrut.empty

const defaultPartStruts: Struts = {
  top: defaultVStrut,
  right: defaultHStrut,
  bottom: defaultVStrut,
  left: defaultHStrut,
}

/**
 * Upgrade a partial set of struts per direction into a total one.
 * @category drawing
 */
export const normalizeStruts = (struts?: Partial<Struts>): Struts => ({
  ...defaultPartStruts,
  ...(filterDefined(struts ?? {}) as Struts),
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

HStruts.fill =
  ({left, right}: HStruts) =>
  (availableLeft: number, availableRight: number): EndoOf<string> =>
  line =>
    HStrut.fill(left)(availableLeft) + line + HStrut.fill(right)(availableRight)

VStruts.fill =
  ({top, bottom}: VStruts) =>
  ([availableTop, availableBottom]: [number, number]) =>
  (lines: string[]) =>
    [
      ...VStrut.fill(top)(availableTop),
      ...lines,
      ...VStrut.fill(bottom)(availableBottom),
    ] as NonEmptyArray<string>

/**
 * Create {@link Struts} from horizontal and vertical struts. If only a pair
 * is given it will be used for all directions. If none are given returns the
 * default struts of empty line and space.
 * @category drawing
 */
export const Struts = (
  top: VStrut = defaultVStrut,
  right: HStrut = defaultHStrut,
  bottom: VStrut = top,
  left: HStrut = right,
): Struts => ({
  top,
  right,
  bottom,
  left,
})
