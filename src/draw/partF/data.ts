import {type Aligned, type HorizontallyAligned} from '../align.js'

import {ColumnF, EmptyF, RowF, TextF} from './types.js'

/**
 * @category drawing
 */
export const emptyF: EmptyF = EmptyF()

/**
 * @category drawing
 */
export const textF = (show: string): TextF => TextF({show})

/**
 * @category drawing
 */
export const rowF =
  ({hAlign, vAlign, hStrut, vStrut}: Aligned) =>
  <A>(cells: A[]): RowF<A> =>
    RowF({hAlign, vAlign, hStrut, vStrut, cells})

/**
 * @category drawing
 */
export const columnF =
  ({hAlign, hStrut}: HorizontallyAligned) =>
  <A>(cells: A[]): ColumnF<A> =>
    ColumnF({hAlign, hStrut, cells})
