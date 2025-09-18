import type {EndoOf} from '#util/Function'
import {floorMod2} from '#util/Number'
import {stringWidth, widestLine} from '#util/String'
import {Array, pipe} from 'effect'
import {HStrut} from '../struts.js'
import {matchHorizontal, type HorizontalAlignment} from './data.js'

/**
 * Align an array of single line strings according to the given alignment.
 * All strings in the returned array will be as wide as the widest among them.
 * The given padding string is used to fill available space, if it exists.
 * @category drawing
 */
export const alignHorizontally =
  (hStrut: HStrut, align: HorizontalAlignment): EndoOf<string[]> =>
  lines => {
    if (lines.length <= 1) return lines

    const available = widestLine(lines)
    const computeΔ = (line: string) => available - stringWidth(line)

    return pipe(
      lines,
      Array.map(line => {
        const Δ = computeΔ(line)
        return Δ <= 0 ? line : expand(hStrut, align, Δ)(line)
      }),
    )
  }

// Expand a line to fill available space according to given alignment.
function expand(hStrut: HStrut, alignment: HorizontalAlignment, Δ: number) {
  return (line: string) =>
    pipe(
      alignment,
      matchHorizontal(
        () => line + HStrut.fill(hStrut)(Δ),
        () => {
          const [quotient, remainder] = floorMod2(Δ)
          return (
            HStrut.fill(hStrut)(quotient) +
            line +
            HStrut.fill(hStrut)(remainder + quotient)
          )
        },
        () => HStrut.fill(hStrut)(Δ) + line,
      ),
    )
}
//
