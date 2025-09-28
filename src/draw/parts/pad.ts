import {filterDefined, monoRecord} from '#Record'
import {directions, type Directed} from '../direction.js'
import {normalizeStruts, type Struts} from '../struts.js'

/**
 * An object with a possibly zero padding at every direction.
 * @category drawing
 */
export type DirectedPad = Directed<number>

/**
 * An object with a possibly zero padding at every direction and a strut for
 * each such padding: a pair of _vertical_ struts for the _top_ and _bottom_,
 * and a pair of _horizontal_ struts for the _left_ and _right_.
 * @category drawing
 */
export interface Padded {
  /** How wide/tall should padding be in every direction? */
  pad: DirectedPad
  /** With what do we fill available pad space in every direction? */
  padStruts: Struts
}

/**
 * Upgrade a partial {@link DirectedPad} into a total one, filling in empty
 * slots with zeros.
 * @category drawing
 * @function
 */
export const normalizePad = (padded?: Partial<DirectedPad>): DirectedPad => ({
  ...monoRecord(0)(...directions),
  ...filterDefined(padded ?? {}),
})

/**
 * Upgrade a partial {@link Padded} into a total one, filling in with defaults.
 * @category drawing
 * @function
 */
export const normalizePadded = (
  padded?: Partial<{
    pad?: Partial<DirectedPad>
    padStruts?: Partial<Struts>
  }>,
): Padded => ({
  padStruts: normalizeStruts(padded?.padStruts),
  pad: normalizePad(padded?.pad),
})

/**
 * Compute pad width for the given {@link Padded}.
 * @category drawing
 * @function
 */
export const computePadWidth = ({pad: {left, right}}: Padded): number =>
  left + right

/**
 * Compute pad height for the given {@link Padded}.
 * @category drawing
 * @function
 */
export const computePadHeight = ({pad: {top, bottom}}: Padded): number =>
  top + bottom

/**
 * Add the width of the given padded to the given width.
 * @category drawing
 * @function
 */
export const addPadWidth =
  ({pad: {left, right}}: Padded) =>
  (width: number): number =>
    left + width + right

/**
 * Add the height of the given padded to the given height.
 * @category drawing
 * @function
 */
export const addPadHeight =
  ({pad: {top, bottom}}: Padded) =>
  (height: number): number =>
    top + height + bottom

/**
 * Compute padding width/hight for the given {@link Padded}.
 * @category drawing
 * @function
 */
export const computePadSize = (
  padded: Padded,
): [width: number, height: number] => [
  computePadWidth(padded),
  computePadHeight(padded),
]

/**
 * Add the given width and height to the given {@link Padded}.
 * @category drawing
 * @function
 */
export const addPadSize =
  (padded: Padded) =>
  (width: number, height: number): [width: number, height: number] => [
    width + computePadWidth(padded),
    height + computePadHeight(padded),
  ]

/**
 * Build a padding entry for every direction from a partial list of values.
 * @category drawing
 * @function
 */
export const padding = (
  top: number,
  right?: number,
  bottom?: number,
  left?: number,
): DirectedPad =>
  right === undefined
    ? monoRecord(top)(...directions)
    : bottom === undefined
      ? {
          ...monoRecord(top)('top', 'bottom'),
          ...monoRecord(right)('left', 'right'),
        }
      : left === undefined
        ? {top, bottom, ...monoRecord(right)('left', 'right')}
        : {top, right, bottom, left}

/**
 * A {@link DirectedPad} of zero padding in all directions.
 * @category drawing
 */
export const noPadding: DirectedPad = monoRecord(0)(...directions)
