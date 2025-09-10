import type {EndoOf} from '#util/Function'
import {flow, pipe} from 'effect'
import {fix, unfix} from 'effect-ts-folds'
import type {NonEmptyArray} from 'effect/Array'
import {mapHorizontalAlignments, mapVerticalAlignments} from './align/data.js'
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
  type HorizontalAlignment,
  type Part,
  type Row,
  type VerticalAlignment,
} from './types.js'

export const text = textPart

export const fixPart = <Type extends Part>(unfixed: PartF<Part>): Type =>
    fix<PartFTypeLambda>(unfixed) as Type,
  unfixPart = <Type extends PartF<Part>>(fixed: Part): Type =>
    unfix<PartFTypeLambda>(fixed) as Type,
  unfixRow = (fixed: Row): RowF<Part> => unfixPart(fixed),
  unfixColumn = (fixed: Column): ColumnF<Part> => unfixPart(fixed)

/** The empty part constant. */
export const empty: Empty = fixPart<Empty>(emptyF)

const defaultHStrut = text(' '),
  defaultVStrut: NonEmptyArray<Text> = [defaultHStrut],
  defaultStruts: [Text, NonEmptyArray<Text>] = [defaultHStrut, defaultVStrut]

/** Combine parts horizontally. */
export const row =
    (vAlign: VerticalAlignment) =>
    (hAlign: HorizontalAlignment) =>
    (
      cells: Part[],
      [hStrut, vStrut]: [
        hStrut: Text,
        vStrut?: NonEmptyArray<Text>,
      ] = defaultStruts,
    ): Row =>
      fixPart<Row>(
        rowF([hAlign, vAlign])([hStrut, vStrut ?? defaultVStrut])(cells),
      ),
  /** Combine parts vertically. */
  column =
    (align: HorizontalAlignment) =>
    (cells: Part[], strut?: Text): Column =>
      fixPart<Column>(columnF(align, strut ?? defaultHStrut)(cells))

export const [isEmptyPart, isText, isRow, isColumn] = [
  (self: Part): self is Empty => pipe(self, unfixPart, isPartFOf('EmptyF')),
  (self: Part): self is Text => pipe(self, unfixPart, isPartFOf('TextF')),
  (self: Part): self is Row => pipe(self, unfixPart, isPartFOf('RowF')),
  (self: Part): self is Column => pipe(self, unfixPart, isPartFOf('ColumnF')),
]

export const getText: (text: Text) => string = ({unfixed: {show}}) => show

/**
 * Combine two text parts horizontally placing the first to the right of the
 * second.
 */
export const prefixText: (prefix: Text) => EndoOf<Text> =
    ({unfixed: {show: prefix}}) =>
    ({unfixed: {show: suffix}}) =>
      text(prefix + suffix),
  /**
   * Combine two text parts horizontally placing the first to the left of the
   * second.
   */
  suffixText: (suffix: Text) => EndoOf<Text> =
    ({unfixed: {show: suffix}}) =>
    ({unfixed: {show: prefix}}) =>
      text(prefix + suffix)

/** Add the prefix part to the left of the suffix part. */
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
      row(vAlign)(hAlign)([prefix, suffix], [hStrut, vStrut ?? defaultVStrut]),
  /** Add the suffix part to the right of the prefix part. */
  after =
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

/** Add the `below` part below the `above` part. */
export const below =
    (align: HorizontalAlignment) =>
    (above: Part, strut?: Text) =>
    (below: Part) =>
      column(align)([above, below], strut),
  /** Add the `above` part above the `below` part. */
  above =
    (align: HorizontalAlignment) =>
    (below: Part, strut?: Text) =>
    (above: Part) =>
      column(align)([above, below], strut)

/** Match part by type. */
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

export const emptyLine = text('')

export const [topRow, middleRow, bottomRow] = mapVerticalAlignments(row),
  [leftColumn, centerColumn, rightColumn] = mapHorizontalAlignments(column)

export const [topLeftRow, topCenterRow, topRightRow] =
    mapHorizontalAlignments(topRow),
  [middleLeftRow, middleCenterRow, middleRightRow] =
    mapHorizontalAlignments(middleRow),
  [bottomLeftRow, bottomCenterRow, bottomRightRow] =
    mapHorizontalAlignments(bottomRow)

export const [beforeTop, beforeMiddle, beforeBottom] =
    mapVerticalAlignments(before),
  [afterTop, afterMiddle, afterBottom] = mapVerticalAlignments(after),
  [aboveLeft, aboveCenter, aboveRight] = mapHorizontalAlignments(above),
  [belowLeft, belowCenter, belowRight] = mapHorizontalAlignments(below)

export const [beforeTopLeft, beforeTopCenter, beforeTopRight] =
    mapHorizontalAlignments(beforeTop),
  [beforeMiddleLeft, beforeMiddleCenter, beforeMiddleRight] =
    mapHorizontalAlignments(beforeMiddle),
  [beforeBottomLeft, beforeBottomCenter, beforeBottomRight] =
    mapHorizontalAlignments(beforeBottom)
