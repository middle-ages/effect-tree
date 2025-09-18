import {Array, Function, Number, Pair, Tuple} from '#util'
import {identity, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {VStrut} from '../struts.js'
import {matchVertical, type VerticalAlignment} from './data.js'

/**
 * Vertically and horizontally align an array of arrays of single line
 * strings according to the given alignments.
 *
 * All columns in the returned array will be as tall as the tallest among
 * them. The given vertical strut will be used to fill the available
 * vertical space.
 *
 * For each column we run the given `alignOrthogonal` function, where you
 * can set horizontal alignment and padding to make sure every row, per
 * column is of the same width.
 * @category drawing
 */
export const alignVertically =
  (
    vStrut: VStrut,
    align: VerticalAlignment,
    alignOrthogonal: Function.EndoOf<string[]>,
  ) =>
  (columns: Array.NonEmptyArray<string[]>): NonEmptyArray<string[]> => {
    const available = Array.longestChildLength(columns)

    return available === 0
      ? columns
      : pipe(
          columns,
          Array.map(column => {
            const Δ = available - column.length
            return pipe(
              column,
              Δ <= 0 ? identity : expand(vStrut, align, Δ),
              alignOrthogonal,
            )
          }),
        )
  }

// Expand column vertically by given delta according to given alignment,
// filling with as possible of the vertical strut.
function expand(
  vStrut: VStrut,
  align: VerticalAlignment,
  Δ: number,
): Function.EndoOf<string[]> {
  return pipe(
    align,
    matchVertical<[number, number]>(
      () => [Δ, 0],
      () => {
        const [quotient, remainder] = Number.floorMod2(Δ)
        return [quotient, quotient + remainder]
      },
      () => [0, Δ],
    ),
    Pair.pairMap(VStrut.fill(vStrut)),
    Tuple.swap,
    Array.surroundArray,
  )
}
