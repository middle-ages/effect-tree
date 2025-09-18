import {filterDefined, monoRecord} from '#util/Record'
import {directions, type Directed} from '../direction.js'
import {normalizeAxisStruts, type AxisStruts} from '../struts.js'

/**
 * An object with a possibly zero padding at every direction.
 * @category drawing
 */
export type DirectedPad = Directed<number>

/**
 * An object with a possibly zero padding at every direction and a strut for
 * each such padding: a _vertical_ strut for the _top_ and _bottom_, and a
 * _horizontal_ strut for the _left_ and _right_.
 * @category drawing
 */
export interface Padded {
  /** How wide/tall should padding be in every direction? */
  pad: DirectedPad
  /** With what do we fill available pad space in every direction? */
  padStruts: AxisStruts
}

/**
 * Upgrade a partial {@link DirectedPad} into a total one, filling in empty
 * slots with zeros.
 * @category drawing
 */
export const normalizePad = (padded?: Partial<DirectedPad>): DirectedPad => ({
  ...monoRecord(0)(...directions),
  ...filterDefined(padded ?? {}),
})

/**
 * Upgrade a partial {@link Padded} into a total one, filling in with defaults.
 * @category drawing
 */
export const normalizePadded = (
  padded?: Partial<{
    pad?: Partial<DirectedPad>
    padStruts?: Partial<AxisStruts>
  }>,
): Padded => ({
  padStruts: normalizeAxisStruts(padded?.padStruts),
  pad: normalizePad(padded?.pad),
})

export const computePadWidth = ({pad: {left, right}}: Padded): number =>
  left + right

export const computePadHeight = ({pad: {top, bottom}}: Padded): number =>
  top + bottom

export const addPadWidth =
  ({pad: {left, right}}: Padded) =>
  (width: number): number =>
    left + width + right

export const addPadHeight =
  ({pad: {top, bottom}}: Padded) =>
  (height: number): number =>
    top + height + bottom

export const computePadSize = (
  padded: Padded,
): [width: number, height: number] => [
  computePadWidth(padded),
  computePadHeight(padded),
]

export const addPadSize =
  (padded: Padded) =>
  (width: number, height: number): [width: number, height: number] => [
    width + computePadWidth(padded),
    height + computePadHeight(padded),
  ]

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

export const noPadding: DirectedPad = monoRecord(0)(...directions)
