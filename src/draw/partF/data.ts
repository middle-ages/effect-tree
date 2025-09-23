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
  (aligned: Aligned) =>
  <A>(cells: A[]): RowF<A> =>
    RowF({...aligned, cells})

/**
 * @category drawing
 */
export const columnF =
  (hAligned: HorizontallyAligned) =>
  <A>(cells: A[]): ColumnF<A> =>
    ColumnF({...hAligned, cells})
