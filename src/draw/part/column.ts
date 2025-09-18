import type {EndoOf} from '#util/Function'
import {forHorizontalAlignments, type HorizontalAlignment} from '../align.js'
import {defaultHStrut, type HStrut} from '../struts.js'
import {
  Column,
  type HorizontalOps,
  type Part,
  type VerticalOp,
} from './types.js'

const _column =
  (hAlign: HorizontalAlignment = 'center') =>
  (cells: Part[], hStrut = defaultHStrut): Column =>
    Column({hAlign, hStrut})(cells)

/**
 * Combine parts vertically.
 *
 * The 1st cell will be drawn at the top of the column, the final at the bottom.
 * @category drawing
 */
export const column: ((
  hAlign?: HorizontalAlignment,
) => (cells: Part[], hStrut?: HStrut) => Part) &
  Record<HorizontalAlignment, (cells: Part[], hStruct?: HStrut) => Part> =
  Object.assign(_column, forHorizontalAlignments(_column))

const _below =
  (hAlign: HorizontalAlignment = 'center'): VerticalOp =>
  (above, hStrut = defaultHStrut) =>
  below =>
    Column({hAlign, hStrut})([above, below])

const _above: typeof _below = hAlign => (below, hStrut) => above =>
  _below(hAlign)(above, hStrut)(below)

/**
 * Add the `below` part below the `above` part. See {@link above} for a flipped
 * version.
 * @category drawing
 */
export const below: {
  (hAlign?: HorizontalAlignment): VerticalOp
} & HorizontalOps = Object.assign(
  (hAlign?: HorizontalAlignment) =>
    (above: Part, hStrut?: HStrut): EndoOf<Part> =>
    below =>
      _below(hAlign)(above, hStrut)(below),
  forHorizontalAlignments(_below),
)

/**
 * Add the `below` part below the `above` part. See {@link below} for a flipped
 * version.
 * @category drawing
 */
export const above: {
  (hAlign?: HorizontalAlignment): VerticalOp
} & HorizontalOps = Object.assign(
  (hAlign?: HorizontalAlignment) =>
    (below: Part, hStrut?: HStrut): EndoOf<Part> =>
    above =>
      _above(hAlign)(below, hStrut)(above),
  forHorizontalAlignments(_above),
)
