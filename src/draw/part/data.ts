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
 * @category drawing
 */
export const empty: Empty = fixPart(emptyF)

/**
 * Build a part from a single line of text.
 * @category drawing
 * @function
 */
export const text = (show: string): Text => ({unfixed: textF(show)})

/**
 * Type guard for the {@link Empty} {@link Part}.
 * @category drawing
 * @function
 */
export const isEmptyPart = (self: Part): self is Empty =>
  pipe(self, unfixPart, isPartFOf('EmptyF'))

/**
 * Type guard for the {@link Text} {@link Part}.
 * @category drawing
 * @function
 */
export const isText = (self: Part): self is Text =>
  pipe(self, unfixPart, isPartFOf('TextF'))

/**
 * Type guard for the {@link Row} {@link Part}.
 * @category drawing
 * @function
 */
export const isRow = (self: Part): self is Row =>
  pipe(self, unfixPart, isPartFOf('RowF'))

/**
 * Type guard for the {@link Column} {@link Part}.
 * @category drawing
 * @function
 */
export const isColumn = (self: Part): self is Column =>
  pipe(self, unfixPart, isPartFOf('ColumnF'))

/**
 * Get the text content of a {@link Text} part.
 * @category drawing
 * @function
 */
export const getText: (text: Text) => string = ({unfixed: {show}}) => show

/**
 * Combine two text parts horizontally placing the first to the right of the
 * second.
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
 * @category drawing
 * @function
 */
export const suffixText: (suffix: Text) => EndoOf<Text> =
  ({unfixed: {show: suffix}}) =>
  ({unfixed: {show: prefix}}) =>
    text(prefix + suffix)

/**
 * Match part by type.
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
