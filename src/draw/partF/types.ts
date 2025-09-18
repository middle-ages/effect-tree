import {HKT} from 'effect'
import {taggedEnum, type TaggedEnum} from 'effect/Data'
import {type HorizontallyAligned, type VerticallyAligned} from '../align.js'

interface ColumnFData<A> extends HorizontallyAligned {
  cells: A[]
}

interface RowFData<A> extends ColumnFData<A>, VerticallyAligned {}

/**
 * A filled rectangular block of characters used by the tree drawing routines as
 * an output type. This is the non-recursive version of {@link Part}.
 * @category drawing
 */
export type PartF<A> = TaggedEnum<{
  EmptyF: {}
  TextF: {show: string}
  RowF: RowFData<A>
  ColumnF: ColumnFData<A>
}>

/**
 * The non-recursive version of the {@link Empty} {@link Part}.
 * @category drawing
 */
export type EmptyF = TaggedEnum.Value<PartF<unknown>, 'EmptyF'>

/**
 * The non-recursive version of the {@link Text} {@link Part}.
 * @category drawing
 */
export type TextF = TaggedEnum.Value<PartF<unknown>, 'TextF'>

/**
 * The non-recursive version of the {@link Row} {@link Part}.
 * @category drawing
 */
export type RowF<A> = TaggedEnum.Value<PartF<A>, 'RowF'>

/**
 * The non-recursive version of the {@link Column} {@link Part}.
 * @category drawing
 */
export type ColumnF<A> = TaggedEnum.Value<PartF<A>, 'ColumnF'>

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
