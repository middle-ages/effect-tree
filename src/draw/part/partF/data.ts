import {HKT} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {taggedEnum, type TaggedEnum} from 'effect/Data'

import type * as Align from '../align/data.js'
import type {Fix} from 'effect-ts-folds'

/**
 * A {@link Part} that displays a single line of text.
 * @category drawing
 */
export type Text = Fix<PartFTypeLambda> & {unfixed: TextF}

/**
 * The column data of the {@link Column} {@link Part}.
 * @category internal
 */
export interface PartColumnData<A> {
  hStrut: Text
  cells: A[]
}

/**
 * The row data of the {@link Row} {@link Part}. It extends
 * {@link PartColumnData}.
 * @category internal
 */
export interface PartRowData<A> extends PartColumnData<A> {
  vStrut: NonEmptyArray<Text>
}

/**
 * A filled rectangular block of characters used by the tree drawing routines as
 * an output type.
 * @category drawing
 */
export type PartF<A> = TaggedEnum<{
  EmptyF: {}
  TextF: {show: string}
  RowF: Align.Aligned & PartRowData<A>
  ColumnF: Align.HorizontallyAligned & PartColumnData<A>
}>

/**
 * The fixed version of the {@link Empty} {@link Part}.
 * @category drawing
 */
export type EmptyF = TaggedEnum.Value<PartF<unknown>, 'EmptyF'>

/**
 * The fixed version of the {@link Text} {@link Part}.
 * @category drawing
 */
export type TextF = TaggedEnum.Value<PartF<unknown>, 'TextF'>

/**
 * The non-recursive version of the {@link Row} {@link Part}.
 * @category drawing
 */
export type RowF<A> = TaggedEnum.Value<PartF<A>, 'RowF'> & PartF<A>

/**
 * The non-recursive version of the {@link Column} {@link Part}.
 * @category drawing
 */
export type ColumnF<A> = TaggedEnum.Value<PartF<A>, 'ColumnF'> & PartF<A>

/**
 * A type lambda for the non-recursive part.
 * @category drawing
 */
export interface PartFTypeLambda extends HKT.TypeLambda {
  readonly type: PartF<this['Target']>
}

/**
 * @category internal
 */
export interface PartFDefinition extends TaggedEnum.WithGenerics<1> {
  readonly taggedEnum: PartF<this['A']>
}

const tagged = taggedEnum<PartFDefinition>()

/**
 * @category drawing
 */
export const isPartFOf = tagged.$is

/**
 * @category drawing
 */
export const EmptyF = tagged.EmptyF

/**
 * @category drawing
 */
export const TextF = tagged.TextF

/**
 * @category drawing
 */
export const RowF = tagged.RowF

/**
 * @category drawing
 */
export const ColumnF = tagged.ColumnF

/**
 * @category drawing
 */
export const isEmptyF = <A>(self: PartF<A>): self is EmptyF =>
  isPartFOf('EmptyF')(self)

/**
 * @category drawing
 */
export const isTextF = <A>(self: PartF<A>): self is TextF =>
  isPartFOf('TextF')(self)

/**
 * @category drawing
 */
export const isRowF = <A>(self: PartF<A>): self is RowF<A> =>
  isPartFOf('RowF')(self)

/**
 * @category drawing
 */
export const isColumnF = <A>(self: PartF<A>): self is ColumnF<A> =>
  isPartFOf('ColumnF')(self)

/**
 * @category drawing
 */
export const emptyF: EmptyF = EmptyF(),
  textF = (show: string): TextF => TextF({show})

/**
 * Build a part from a single line of text.
 * @category internal
 */
export const text = (show: string): Text => ({unfixed: textF(show)})

/**
 * @category drawing
 */
export const rowF =
  ([hAlign, vAlign]: [Align.HorizontalAlignment, Align.VerticalAlignment]) =>
  ([hStrut, vStrut]: [Text, NonEmptyArray<Text>]) =>
  <A>(cells: A[]): RowF<A> =>
    RowF({hAlign, vAlign, hStrut, vStrut, cells})

/**
 * @category drawing
 */
export const columnF =
  (hAlign: Align.HorizontalAlignment, hStrut: Text) =>
  <A>(cells: A[]): ColumnF<A> =>
    ColumnF({hAlign, hStrut, cells})

/**
 * @category drawing
 */
export const matchPartF =
  <A, R>(
    empty: R,
    text: (s: string) => R,
    row: (row: RowF<A>) => R,
    column: (column: ColumnF<A>) => R,
  ): ((part: PartF<A>) => R) =>
  p =>
    isEmptyF(p)
      ? empty
      : isTextF(p)
        ? text(p.show)
        : isRowF(p)
          ? row(p)
          : column(p)
