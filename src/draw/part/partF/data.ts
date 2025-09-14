import {HKT} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {taggedEnum, type TaggedEnum} from 'effect/Data'

import type * as Align from '../align/data.js'
import type {Fix} from 'effect-ts-folds'

export type Text = Fix<PartFTypeLambda> & {unfixed: TextF}

export interface PartColumnData<A> {
  hStrut: Text
  cells: A[]
}

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

export type EmptyF = TaggedEnum.Value<PartF<unknown>, 'EmptyF'>
export type TextF = TaggedEnum.Value<PartF<unknown>, 'TextF'>
export type RowF<A> = TaggedEnum.Value<PartF<A>, 'RowF'> & PartF<A>
export type ColumnF<A> = TaggedEnum.Value<PartF<A>, 'ColumnF'> & PartF<A>

export interface PartFTypeLambda extends HKT.TypeLambda {
  readonly type: PartF<this['Target']>
}

export interface PartFDefinition extends TaggedEnum.WithGenerics<1> {
  readonly taggedEnum: PartF<this['A']>
}

export const {
  $is: isPartFOf,
  EmptyF,
  TextF,
  RowF,
  ColumnF,
} = taggedEnum<PartFDefinition>()

export const [isEmptyF, isTextF, isRowF, isColumnF] = [
  <A>(self: PartF<A>): self is EmptyF => isPartFOf('EmptyF')(self),
  <A>(self: PartF<A>): self is TextF => isPartFOf('TextF')(self),
  <A>(self: PartF<A>): self is RowF<A> => isPartFOf('RowF')(self),
  <A>(self: PartF<A>): self is ColumnF<A> => isPartFOf('ColumnF')(self),
]

export const emptyF: EmptyF = EmptyF(),
  textF = (show: string): TextF => TextF({show})

/** Build a part from a single line of text. */
export const text = (show: string): Text => ({unfixed: textF(show)})

export const rowF =
  ([hAlign, vAlign]: [Align.HorizontalAlignment, Align.VerticalAlignment]) =>
  ([hStrut, vStrut]: [Text, NonEmptyArray<Text>]) =>
  <A>(cells: A[]): RowF<A> =>
    RowF({hAlign, vAlign, hStrut, vStrut, cells})

export const columnF =
  (hAlign: Align.HorizontalAlignment, hStrut: Text) =>
  <A>(cells: A[]): ColumnF<A> =>
    ColumnF({hAlign, hStrut, cells})

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
