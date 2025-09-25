import {flow} from '#util'
import {fix, unfix, type Fix} from 'effect-ts-folds'
import {type Aligned, type HorizontallyAligned} from '../align.js'
import {
  ColumnF,
  EmptyF,
  RowF,
  TextF,
  columnF,
  rowF,
  type PartF,
  type PartFTypeLambda,
} from '../partF.js'

/**
 * The empty part takes up zero horizontal and vertical space. The non-recursive
 * version is {@link EmptyF}.
 *
 * The expanded type:
 *
 * ```ts
 * {unfixed: {}}
 * ```
 * @category drawing
 */
export type Empty = {unfixed: EmptyF} & Fix<PartFTypeLambda>

/**
 * A {@link Part} that displays a single line of text. The non-recursive version
 * is {@link TextF}.
 *
 * The expanded type:
 *
 * ```ts
 * {unfixed: {show: string}}
 * ```
 *
 * @category drawing
 */
export type Text = {unfixed: TextF} & Fix<PartFTypeLambda>

/**
 * A rectangular row of parts that is horizontally and vertically aligned
 * and possibly has horizontal and vertical struts to fill in empty space on
 * alignment. The non-recursive version is {@link RowF}.
 *
 * The expanded type:
 *
 * ```ts
 * {
 *   unfixed: {
 *     cells:  A[]
 *     hAlign: HorizontalAlignment
 *     vAlign: HorizontalAlignment
 *     top:    VStrut
 *     right:  HStrut
 *     bottom: VStrut
 *     left:   HStrut
 *   }
 * }
 * ```
 * @category drawing
 */
export type Row = {unfixed: RowF<Part>} & Fix<PartFTypeLambda>

/**
 * A rectangular column of parts that is horizontally aligned and possibly has a
 * horizontal strut to fill in empty space on alignment. The non-recursive type
 * is {@link ColumnF}.
 * 
 * The expanded type:
 *
 * ```ts
 * {
 *   unfixed: {
 *     cells:  A[]
 *     hAlign: HorizontalAlignment
 *     right:  HStrut
 *     left:   HStrut
 *   }
 * }
 * ```
 * @category drawing
 */
export type Column = {unfixed: ColumnF<Part>} & Fix<PartFTypeLambda>

/**
 * A rectangular block of glyphs. Rectangular only in that it appears as a
 * rectangle on a terminal. There are four types of parts, with the last two
 * being recursive:
 *
 * 1. The {@link Empty}.
 * 2. The {@link Text} part is used for a single line of text.
 * 3. The {@link Row} part is used for a row of parts.
 * 4. The {@link Column} part is used for a column of parts.
 * @category drawing
 */
export type Part = Empty | Text | Row | Column

/**
 * @category drawing
 * @function
 */
export const fixPart = <Type extends Part>(unfixed: PartF<Part>): Type =>
  fix<PartFTypeLambda>(unfixed) as Type

/**
 * @category drawing
 * @function
 */
export const unfixPart = <Type extends PartF<Part>>(fixed: Part): Type =>
  unfix<PartFTypeLambda>(fixed) as Type

/**
 * @category drawing
 * @function
 */
export const unfixRow = (fixed: Row): RowF<Part> => unfixPart(fixed)

/**
 * @category drawing
 * @function
 */
export const unfixColumn = (fixed: Column): ColumnF<Part> => unfixPart(fixed)

/**
 * Combine parts horizontally.
 * @returns A new part that is composed of the given parts.
 * @category drawing
 * @function
 */
export const Row = (aligned: Aligned): ((cells: Part[]) => Row) =>
  flow(rowF(aligned), fixPart<Row>)

/**
 * Combine parts vertically.
 * @category drawing
 * @function
 */
export const Column = (
  hAlign: HorizontallyAligned,
): ((cells: Part[]) => Column) => flow(columnF(hAlign), fixPart<Column>)
