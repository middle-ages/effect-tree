import type {EndoOf} from '#util/Function'
import {forHorizontalAlignments, type HorizontalAlignment} from '../align.js'
import {defaultHStrut, type HStrut} from '../struts.js'
import {Column, type Part} from './types.js'

/**
 * @category drawing
 */
export interface ColumnOp {
  (that: Part, left?: HStrut, right?: HStrut): EndoOf<Part>
}

/**
 * @category drawing
 */
export type ColumnOps = Record<HorizontalAlignment, ColumnOp>

const _column =
  (hAlign: HorizontalAlignment = 'center') =>
  (cells: Part[], left = defaultHStrut, right = left): Column =>
    Column({hAlign, left, right})(cells)

/**
 * Combine parts vertically.
 *
 * The first cell will be drawn at the top of the column, the final at the bottom.
 *
 * The alignment is given in the first argument list. If none is given, nodes are
 * aligned to the _center_.
 *
 * The horizontal struts are given in the second argument list, as optional
 * arguments following the `cells` argument. If only a single strut is given,
 * it is used for both the left and right side of the aligned part.
 *
 * If two struts are given, the first is used for the left side and the second
 * for the right side.
 * @category drawing
 * @function
 */
export const column: ((
  hAlign?: HorizontalAlignment,
) => (cells: Part[], left?: HStrut, right?: HStrut) => Part) &
  Record<
    HorizontalAlignment,
    (cells: Part[], left?: HStrut, right?: HStrut) => Part
  > = Object.assign(_column, forHorizontalAlignments(_column))

const _below =
  (hAlign: HorizontalAlignment = 'center'): ColumnOp =>
  (above, left = defaultHStrut, right = left) =>
  below =>
    Column({hAlign, left, right})([above, below])

const _above: typeof _below = hAlign => (below, left, right) => above =>
  _below(hAlign)(above, left, right)(below)

/**
 * Add the `below` part below the `above` part. See {@link above} for a flipped
 * version.
 * @category drawing
 * @function
 */
export const below: {
  (hAlign?: HorizontalAlignment): ColumnOp
} & ColumnOps = Object.assign(
  (hAlign?: HorizontalAlignment) =>
    (above: Part, left?: HStrut, right?: HStrut): EndoOf<Part> =>
    below =>
      _below(hAlign)(above, left, right)(below),
  forHorizontalAlignments(_below),
)

/**
 * Add the `below` part below the `above` part. See {@link below} for a flipped
 * version.
 * @category drawing
 * @function
 */
export const above: {
  (hAlign?: HorizontalAlignment): ColumnOp
} & ColumnOps = Object.assign(
  (hAlign?: HorizontalAlignment) =>
    (below: Part, left?: HStrut, right?: HStrut): EndoOf<Part> =>
    above =>
      _above(hAlign)(below, left, right)(above),
  forHorizontalAlignments(_above),
)
