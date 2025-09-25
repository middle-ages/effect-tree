import {Tuple, identity, pipe, Array, Function, Number} from '#util'
import type {EndoOf} from '#Function'
import {VStruts} from '../struts.js'
import {matchVertical, type VerticalAlignment} from './data.js'

/**
 * Vertically and horizontally align an array of arrays of single line
 * strings according to the given alignments.
 *
 * All columns in the returned array will be as tall as the tallest among
 * them. The given vertical struts will be used to fill the available vertical
 * space: the top and the bottom struts filling each direction respectively.
 *
 * The struts will add zero or one strings, from their `prefix`/`body`/`suffix`
 * fields to each line they create for the purpose of alignment. The rest of the
 * line will remain empty, to be filled by the horizontal alignment given
 * in `alignOrthogonal`.
 *
 * For each column we run the given `alignOrthogonal` function, where you
 * can set horizontal alignment and padding to make sure every row, per
 * column is of the same width.
 *
 * If the vertical alignment is `center`, you can configure the handling of the
 * remainder using the optional `useTopRound` argument, by default `false`.
 *
 * Remainders pop up when the height of the available space left for padding
 * around the aligned item is _odd_. By default we add the remainder to the
 * _bottom_ of what we are aligning, so that it will appear _above_ where it
 * should be.
 *
 * For example, when aligning a single row part with a a taller part that
 * renders to an _even_ number of rows, we need to decide if we add the
 * remaining space, which is an _odd_ number, above or below what is being
 * aligned.
 *
 * The default rounding it to the _bottom_, meaning the remainder is added to
 * the bottom pushing the aligned text up so it will appear _above_ the center:
 *
 * ```ts
 * Default useTopRound=false   1 ┌─────────┐
 * remainder ┌───────────────┐-2 │Tall part│
 * is added  │single row part│ 3 │with an  │
 * to shape  └───────────────┘-4 │even     │
 * bottom                      5 │height   │
 *                             6 └─────────┘
 * ```
 *
 * If you set `useTopRound` to true, or call the variant of this function
 * `alignVertically.useTopRound`, the remainder will be added _above_ the shape
 * pushing the shape down so it appears _below_ the center:
 *
 * ```ts
 * When useTopRound=true       1 ┌─────────┐
 * remainder is added          2 │Tall part│
 * to shape  ┌───────────────┐-3 │with an  │
 * top       │single row part│ 4 │even     │
 *           └───────────────┘-5 │height   │
 *                             6 └─────────┘
 * ```
 *
 * @param vStruts - Top and bottom vertical struts will be used to fill available space.
 * @param vAlign - A vertical alignment will be used when not all shapes are of the same height.
 * @param alignOrthogonal - A function that accepts a list of strings at different widths and returns them at the width of the widest, respecting alignments and struts.
 * @param useTopRound - Optional flag determining if remainder is added above or below the shape. By default it is `false` and the remainder is added below the shape.
 * @category drawing
 * @function
 */
export const alignVertically =
  (
    vStruts: VStruts,
    vAlign: VerticalAlignment,
    alignOrthogonal: Function.EndoOf<string[]>,
    useTopRound = false,
  ): EndoOf<Array.NonEmptyArray<string[]>> =>
  columns => {
    const available = Array.longestChildLength(columns)

    return available === 0
      ? columns
      : pipe(
          columns,
          Array.map(column => {
            const Δ = available - column.length
            return pipe(
              column,
              Δ <= 0 ? identity : expand(vStruts, vAlign, Δ, useTopRound),
              alignOrthogonal,
            )
          }),
        )
  }

alignVertically.useTopRound = (
  vStruts: VStruts,
  vAlign: VerticalAlignment,
  alignOrthogonal: Function.EndoOf<string[]>,
) => alignVertically(vStruts, vAlign, alignOrthogonal, true)

// Expand column vertically by given delta according to given alignment,
// filling with as possible of the vertical strut.
function expand(
  vStruts: VStruts,
  align: VerticalAlignment,
  Δ: number,
  useTopRound = false,
): Function.EndoOf<string[]> {
  return pipe(
    align,
    matchVertical<[number, number]>(
      () => [Δ, 0],
      () => Number[useTopRound ? 'halfToFirst' : 'halfToSecond'](Δ),
      () => [0, Δ],
    ),
    Tuple.swap,
    VStruts.fill(vStruts),
  )
}
