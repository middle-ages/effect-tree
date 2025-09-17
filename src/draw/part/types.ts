import type {Fix} from 'effect-ts-folds'
import {Array} from 'effect'
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

/**
 * Empty areas in rows are filled with these _struts_ according to the row
 * `horizontal` alignment.
 *
 * The default, used when no struts are given to a {@link row},
 * is a single space character for both. However you can set them to glyphs
 * which can be sometimes useful. The basic tree layout uses struts to draw the
 * line joints for example.
 *
 * The vertical struts are defined as a non-empty array of {@link Text} parts. They
 * are used to align parts vertically when building _rows_. The 1st vertical
 * strut is used for the 1st row, the 2nd for the 2nd, and so on. If there are
 * more rows to align than struts available, the pattern is repeated.
 *
 * Only a single vertical strut is added to align a part per each row,
 * regardless of its _width_.
 *
 * This is why rows can also be aligned _horizontally_ and require besides the
 * vertical struts a _horizontal_ strut: we need to fill every row where the
 * single strut was added, and the strut is not as wide as the row width.
 *
 * The horizontal strut is defined a {@link Text} part. It will be repeated per
 * row to fill in areas left empty by the addition of a vertical strut.
 * @category drawing
 */
export type RowStruts = [hStrut: Text, vStrut?: Array.NonEmptyArray<Text>]
