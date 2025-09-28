import type {EndoOf} from '#Function'
import {flow, pipe} from 'effect'
import {emptyF, isPartFOf, matchPartF, textF} from '../partF.js'
import {
  Column,
  fixPart,
  Row,
  unfixPart,
  type Empty,
  type Part,
  type Text,
} from './types.js'

/**
 * The empty part takes zero width and zero height.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const part = Draw.row.centre.middle([
 *   Draw.text('hello-),
 *   Draw.empty,
 *   Draw.text('world),
 *
 * expect(Draw.drawPart(part)).toEqual(['hello-world'])
 * @category drawing
 */
export const empty: Empty = fixPart(emptyF)

/**
 * Build a part from a single line of text.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const part = Draw.text('hello')
 *
 * expect(Draw.drawPart(part)).toEqual(['hello'])
 * @category drawing
 * @function
 */
export const text: (show: string) => Text = flow(textF, fixPart<Text>)

/**
 * Type guard for the {@link Empty} {@link Part}.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const part1 = Draw.text('hello')
 * const part2 = Draw.empty
 *
 * expect(Draw.isEmptyPart(part1), 'not empty').toBe(false)
 * expect(Draw.isEmptyPart(part2), 'empty').toBe(true)
 * @category drawing
 * @function
 */
export const isEmptyPart = (self: Part): self is Empty =>
  pipe(self, unfixPart, isPartFOf('EmptyF'))

/**
 * Type guard for the {@link Text} {@link Part}.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const part1 = Draw.text('hello')
 * const part2 = Draw.empty
 *
 * expect(Draw.isText(part1), 'text').toBe(true)
 * expect(Draw.isText(part2), 'not text').toBe(false)
 * @category drawing
 * @function
 */
export const isText = (self: Part): self is Text =>
  pipe(self, unfixPart, isPartFOf('TextF'))

/**
 * Type guard for the {@link Row} {@link Part}.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const part1 = Draw.text('hello')
 * const part2 = Draw.row.top.left([part1])
 *
 * expect(Draw.isRow(part1), 'not a row').toBe(false)
 * expect(Draw.isRow(part2), 'a row').toBe(true)
 * @category drawing
 * @function
 */
export const isRow = (self: Part): self is Row =>
  pipe(self, unfixPart, isPartFOf('RowF'))

/**
 * Type guard for the {@link Column} {@link Part}.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const part1 = Draw.column.left([Draw.text('foo')])
 * const part2 = Draw.row.top.left([part1])
 *
 * expect(Draw.isColumn(part1), 'a column').toBe(true)
 * expect(Draw.isColumn(part2), 'not a column').toBe(false)
 * @category drawing
 * @function
 */
export const isColumn = (self: Part): self is Column =>
  pipe(self, unfixPart, isPartFOf('ColumnF'))

/**
 * Get the text content of a {@link Text} part.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const part = Draw.text('foo')
 *
 * expect(Draw.getText(part)).toBe('foo')
 * @category drawing
 * @function
 */
export const getText: (text: Text) => string = ({unfixed: {show}}) => show

/**
 * Combine two text parts horizontally placing the first to the right of the
 * second.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const left = Draw.text('foo-')
 * const right = Draw.text('bar')
 *
 * expect(Draw.prefixText(left)(right)).toEqual(Draw.text('foo-bar'))
 * @category drawing
 * @function
 */
export const prefixText: (prefix: Text) => EndoOf<Text> =
  ({unfixed: {show: prefix}}) =>
  ({unfixed: {show: suffix}}) =>
    text(prefix + suffix)

/**
 * Combine two text parts horizontally placing the first to the left of the
 * second.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const left = Draw.text('foo-')
 * const right = Draw.text('bar')
 *
 * expect(Draw.suffixText(right)(left)).toEqual(Draw.text('foo-bar'))
 * @category drawing
 * @function
 */
export const suffixText: (suffix: Text) => EndoOf<Text> =
  ({unfixed: {show: suffix}}) =>
  ({unfixed: {show: prefix}}) =>
    text(prefix + suffix)

/**
 * Match part by type.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const emptyPart  = Draw.empty
 * const textPart   = Draw.text('foo')
 * const rowPart    = Draw.row.top.right([textPart])
 * const columnPart = Draw.column.right([textPart])
 *
 * const match = Draw.matchPart(
 *   'empty',
 *   s => `text=${s}`,
 *   () => 'row',
 *   () => 'column',
 * )
 *
 * expect(match(emptyPart), 'empty').toBe('empty')
 * expect(match(textPart), 'text').toBe('text=foo')
 * expect(match(rowPart), 'row').toBe('row')
 * expect(match(columnPart), 'column').toBe('column')
 * @category drawing
 * @function
 */
export const matchPart =
  <R>(
    onEmpty: R,
    onText: (s: string) => R,
    onRow: (r: Row) => R,
    onColumn: (c: Column) => R,
  ): ((p: Part) => R) =>
  part =>
    pipe(
      part,
      unfixPart,
      matchPartF(
        onEmpty,
        onText,
        flow(fixPart<Row>, onRow),
        flow(fixPart<Column>, onColumn),
      ),
    )
