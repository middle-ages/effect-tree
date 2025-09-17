import type {EndoOf} from '#util/Function'
import {flow, pipe} from 'effect'
import {fix, unfix} from 'effect-ts-folds'
import type {NonEmptyArray} from 'effect/Array'
import type {HorizontalAlignment, VerticalAlignment} from './align/data.js'
import {mapVerticalAlignments} from './align/data.js'
import {
  columnF,
  ColumnF,
  emptyF,
  isPartFOf,
  matchPartF,
  rowF,
  RowF,
  text as textPart,
  type PartF,
  type PartFTypeLambda,
  type Text,
} from './partF.js'
import {
  type Column,
  type Empty,
  type Part,
  type Row,
  type RowStruts,
} from './types.js'

export const text = textPart

export const fixPart = <Type extends Part>(unfixed: PartF<Part>): Type =>
    fix<PartFTypeLambda>(unfixed) as Type,
  unfixPart = <Type extends PartF<Part>>(fixed: Part): Type =>
    unfix<PartFTypeLambda>(fixed) as Type,
  unfixRow = (fixed: Row): RowF<Part> => unfixPart(fixed),
  unfixColumn = (fixed: Column): ColumnF<Part> => unfixPart(fixed)

/**
 * The empty part constant.
 * @category drawing
 */
export const empty: Empty = fixPart<Empty>(emptyF)

const defaultHStrut = text(' '),
  defaultVStrut: NonEmptyArray<Text> = [defaultHStrut],
  defaultStruts: RowStruts = [defaultHStrut, defaultVStrut]

/**
 * Combine parts horizontally.
 * @param vAlign - we are combining parts horizontally, and they could be of
 * different heights. But we must always produce a rectangular area. We need
 * to fill the areas that are empty. But where do we place the vertical strut
 * intended for this purpose: above or below the part we are aligning, or
 * maybe both? This is set by this argument: how to align parts when they are
 * shorter than the tallest part in the row.
 * @returns A new part where all the given parts are arranged in a row layout.
 * @category drawing
 */
export const row =
  (vAlign: VerticalAlignment) =>
  /**
   * The vertical struts we use to fill the rectangular area
   * according to the given vertical alignment are given as a list of strings that
   * could be 1 to N glyphs wide. This means they could leave space in the row. We
   * fill it with the given horizontal strut and use this argument to determine
   * the horizontal alignment of the single vertical strut. We add a vertical
   * strut per each part that is shorter than the tallest part in the row.
   */
  (hAlign: HorizontalAlignment) =>
  /** Possibly empty list of parts. */
  (
    cells: Part[],
    /** A {@link RowStruts} that configures how empty space will be rendered. */
    [hStrut, vStrut]: RowStruts = defaultStruts,
  ): Row =>
    fixPart<Row>(
      rowF([hAlign, vAlign])([hStrut, vStrut ?? defaultVStrut])(cells),
    )

/**
 * Combine parts vertically.
 * @category drawing
 */
export const column =
  (align: HorizontalAlignment) =>
  (cells: Part[], strut?: Text): Column =>
    fixPart<Column>(columnF(align, strut ?? defaultHStrut)(cells))

/**
 * Type guard for the {@link Empty} {@link Part}.
 * @category drawing
 */
export const isEmptyPart = (self: Part): self is Empty =>
  pipe(self, unfixPart, isPartFOf('EmptyF'))

/**
 * Type guard for the {@link Text} {@link Part}.
 * @category drawing
 */
export const isText = (self: Part): self is Text =>
  pipe(self, unfixPart, isPartFOf('TextF'))

/**
 * Type guard for the {@link Row} {@link Part}.
 * @category drawing
 */
export const isRow = (self: Part): self is Row =>
  pipe(self, unfixPart, isPartFOf('RowF'))

/**
 * Type guard for the {@link Column} {@link Part}.
 * @category drawing
 */
export const isColumn = (self: Part): self is Column =>
  pipe(self, unfixPart, isPartFOf('ColumnF'))

/**
 * Get the text content of a {@link Text} part.
 * @category drawing
 */
export const getText: (text: Text) => string = ({unfixed: {show}}) => show

/**
 * Combine two text parts horizontally placing the first to the right of the
 * second.
 * @category drawing
 */
export const prefixText: (prefix: Text) => EndoOf<Text> =
  ({unfixed: {show: prefix}}) =>
  ({unfixed: {show: suffix}}) =>
    text(prefix + suffix)

/**
 * Combine two text parts horizontally placing the first to the left of the
 * second.
 * @category drawing
 */
export const suffixText: (suffix: Text) => EndoOf<Text> =
  ({unfixed: {show: suffix}}) =>
  ({unfixed: {show: prefix}}) =>
    text(prefix + suffix)

/**
 * Add the prefix part to the left of the suffix part.
 * @category drawing
 */
export const before =
  (vAlign: VerticalAlignment) =>
  (hAlign: HorizontalAlignment) =>
  (
    prefix: Part,
    [hStrut, vStrut]: [
      hStrut: Text,
      vStrut?: NonEmptyArray<Text>,
    ] = defaultStruts,
  ) =>
  (suffix: Part) =>
    row(vAlign)(hAlign)([prefix, suffix], [hStrut, vStrut ?? defaultVStrut])

/**
 * Add the suffix part to the right of the prefix part.
 * @category drawing
 */
export const after =
  (vAlign: VerticalAlignment) =>
  (hAlign: HorizontalAlignment) =>
  (
    suffix: Part,
    [hStrut, vStrut]: [
      hStrut: Text,
      vStrut?: NonEmptyArray<Text>,
    ] = defaultStruts,
  ) =>
  (prefix: Part) =>
    row(vAlign)(hAlign)([prefix, suffix], [hStrut, vStrut ?? defaultVStrut])

/**
 * Add the `below` part below the `above` part.
 * @category drawing
 */
export const below =
  (align: HorizontalAlignment) =>
  (above: Part, strut?: Text) =>
  (below: Part) =>
    column(align)([above, below], strut)

/**
 * Add the `above` part above the `below` part.
 * @category drawing
 */
export const above =
  (align: HorizontalAlignment) =>
  (below: Part, strut?: Text) =>
  (above: Part) =>
    column(align)([above, below], strut)

/**
 * Match part by type.
 * @category drawing
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

/**
 * An empty line part.
 * @category drawing
 */
export const emptyLine = text('')

const [rowTop, rowMiddle, rowBottom] = mapVerticalAlignments(row),
  [beforeTop, beforeMiddle, beforeBottom] = mapVerticalAlignments(before),
  [afterTop, afterMiddle, afterBottom] = mapVerticalAlignments(after)

column.left = column('left')
column.center = column('center')
column.right = column('right')

above.left = above('left')
above.center = above('center')
above.right = above('right')

below.left = below('left')
below.center = below('center')
below.right = below('right')

row.top = Object.assign(rowTop, {
  left: rowTop('left'),
  center: rowTop('center'),
  right: rowTop('right'),
})
row.middle = Object.assign(rowMiddle, {
  left: rowMiddle('left'),
  center: rowMiddle('center'),
  right: rowMiddle('right'),
})
row.bottom = Object.assign(rowBottom, {
  left: rowBottom('left'),
  center: rowBottom('center'),
  right: rowBottom('right'),
})

before.top = Object.assign(beforeTop, {
  left: beforeTop('left'),
  center: beforeTop('center'),
  right: beforeTop('right'),
})
before.middle = Object.assign(beforeMiddle, {
  left: beforeMiddle('left'),
  center: beforeMiddle('center'),
  right: beforeMiddle('right'),
})
before.bottom = Object.assign(beforeBottom, {
  left: beforeBottom('left'),
  center: beforeBottom('center'),
  right: beforeBottom('right'),
})

after.top = Object.assign(afterTop, {
  left: afterTop('left'),
  center: afterTop('center'),
  right: afterTop('right'),
})
after.middle = Object.assign(afterMiddle, {
  left: afterMiddle('left'),
  center: afterMiddle('center'),
  right: afterMiddle('right'),
})
after.bottom = Object.assign(afterBottom, {
  left: afterBottom('left'),
  center: afterBottom('center'),
  right: afterBottom('right'),
})
