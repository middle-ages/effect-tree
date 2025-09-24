import type {EndoOf} from '#util/Function'
import {halfToFirst, halfToSecond} from '#util/Number'
import {stringWidth, widestLine} from '#util/String'
import {Array, pipe} from 'effect'
import {HStrut, HStruts} from '../struts.js'
import {matchHorizontal, type HorizontalAlignment} from './data.js'

/**
 * Align an array of single line strings according to the given alignment.
 * All strings in the returned array will be as wide as the widest among them.
 *
 * The given horizontal struts will be used to fill the available space created
 * by aligning the given parts.
 * @param hStruts - Left and right horizontal struts will be used to fill available space.
 * @param hAlign - A horizontal alignment will be used when not all shapes are of the same width.
 * @param useLeftRound - Optional flag determining if remainder is added to the left or to the right the shape. By default it is `false` and the remainder is added to the _right_ of the shape.
 * @category drawing
 */
export const alignHorizontally =
  (
    hStruts: HStruts,
    hAlign: HorizontalAlignment,
    useLeftRound = false,
  ): EndoOf<string[]> =>
  lines => {
    if (lines.length <= 1) return lines

    const available = widestLine(lines)
    const computeΔ = (line: string) => available - stringWidth(line)

    return pipe(
      lines,
      Array.map(line => {
        const Δ = computeΔ(line)
        return Δ <= 0 ? line : expand(hStruts, hAlign, Δ, useLeftRound)(line)
      }),
    )
  }

// Expand a line to fill available space according to given alignment.
function expand(
  struts: HStruts,
  alignment: HorizontalAlignment,
  Δ: number,
  useLeftRound: boolean,
): EndoOf<string> {
  const {left, right} = struts
  return line =>
    pipe(
      alignment,
      matchHorizontal(
        () => line + HStrut.fill(right)(Δ),
        () =>
          HStruts.fill(struts)(
            ...(useLeftRound ? halfToFirst : halfToSecond)(Δ),
          )(line),
        () => HStrut.fill(left)(Δ) + line,
      ),
    )
}
//
