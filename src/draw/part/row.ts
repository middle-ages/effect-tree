import {flow, type EndoOf} from '#util/Function'
import {
  forHorizontalAlignments,
  forVerticalAlignments,
  type HorizontalAlignment,
  type VerticalAlignment,
} from '../align.js'
import {normalizeStruts, type Struts} from '../struts.js'
import {Row, type Part} from './types.js'

export interface BuildRow {
  (cells: readonly Part[], struts?: Partial<Struts>): Part
}

export interface BuildPart {
  (part: Part, struts?: Partial<Struts>): EndoOf<Part>
}

export type BuildAlignedRow = Record<
  VerticalAlignment,
  Record<HorizontalAlignment, BuildRow>
>
export type BuildAlignedPart = Record<
  VerticalAlignment,
  Record<HorizontalAlignment, BuildPart>
>

const _row =
  (vAlign: VerticalAlignment = 'middle') =>
  (hAlign: HorizontalAlignment = 'center'): BuildRow =>
  (cells, struts) =>
    Row({hAlign, vAlign, ...normalizeStruts(struts)})(cells as Part[])

/**
 * Combine parts horizontally.
 *
 * The 1st cell will be drawn at the left of the row, the final at the bottom.
 * @returns A new part that is composed of the given parts.
 * @category drawing
 */
export const row: {
  (vAlign?: VerticalAlignment): (hAlign?: HorizontalAlignment) => BuildRow
} & BuildAlignedRow = Object.assign(
  _row,
  forVerticalAlignments(flow(_row, forHorizontalAlignments)),
)

const _before =
  (vAlign: VerticalAlignment = 'middle') =>
  (hAlign: HorizontalAlignment = 'center'): BuildPart =>
  (after, struts) =>
  before =>
    row(vAlign)(hAlign)([before, after], struts)

const _after =
  (vAlign: VerticalAlignment = 'middle') =>
  (hAlign: HorizontalAlignment = 'center'): BuildPart =>
  (before, struts) =>
  after =>
    row(vAlign)(hAlign)([before, after], struts)

/**
 * Add the prefix part to the left of the suffix part. See {@link after} for a
 * flipped version.
 * @category drawing
 */
export const before: {
  (vAlign?: VerticalAlignment): (hAlign?: HorizontalAlignment) => BuildPart
} & BuildAlignedPart = Object.assign(
  _before,
  forVerticalAlignments(vAlign =>
    forHorizontalAlignments(hAlign => _before(vAlign)(hAlign)),
  ),
)

/**
 * Add the prefix part to the left of the suffix part. A flipped version of
 * {@link before}.
 * @category drawing
 */
export const after: {
  (vAlign?: VerticalAlignment): (hAlign?: HorizontalAlignment) => BuildPart
} & BuildAlignedPart = Object.assign(
  _after,
  forVerticalAlignments(vAlign =>
    forHorizontalAlignments(hAlign => _after(vAlign)(hAlign)),
  ),
)
