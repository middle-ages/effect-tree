import {type Aligned, type HorizontallyAligned} from '../align.js'

import {ColumnF, EmptyF, RowF, TextF} from './types.js'

/**
 * @category drawing
 */
export const emptyF: EmptyF = EmptyF()

/**
 * @category drawing
 * @function
 */
export const textF = (show: string): TextF => TextF({show})

/**
 * @category drawing
 * @function
 */
export const rowF =
  (aligned: Aligned) =>
  <A>(cells: A[]): RowF<A> =>
    RowF({...aligned, cells})

/**
 * @category drawing
 * @function
 */
export const columnF =
  (hAligned: HorizontallyAligned) =>
  <A>(cells: A[]): ColumnF<A> =>
    ColumnF({...hAligned, cells})
