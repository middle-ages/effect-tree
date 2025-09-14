import type {Fix} from 'effect-ts-folds'
import {
  ColumnF,
  EmptyF,
  type PartFTypeLambda,
  RowF,
  type Text,
} from './partF.js'

/**
 * The empty part takes up zero horizontal and vertical space.
 * @category drawing
 */
export type Empty = {unfixed: EmptyF} & Fix<PartFTypeLambda>

/**
 * A rectangular row of parts that is horizontally and vertically aligned
 * and possibly has horizontal and vertical struts to fill in empty space on
 * alignment.
 * @category drawing
 */
export type Row = {unfixed: RowF<Part>} & Fix<PartFTypeLambda>

/**
 * A rectangular column of parts that is horizontally aligned and possibly has a
 * horizontal strut to fill in empty space on alignment.
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
