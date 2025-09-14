import type {EndoOf} from '#util/Function'
import {floorMod, floorMod2} from '#util/Number'
import {stringWidth, widestLine} from '#util/String'
import {Array, pipe, String} from 'effect'
import {type HorizontalAlignment, matchHorizontal} from './data.js'

/**
 * Align an array of single line strings according to the given alignment.
 * All strings in the returned array will be as wide as the widest among them.
 * The given padding string is used to fill available space, if it exists.
 * @category drawing
 */
export const alignHorizontally =
  (pad: string, align: HorizontalAlignment): EndoOf<string[]> =>
  lines => {
    if (lines.length <= 1) return lines

    const available = widestLine(lines)
    const computeΔ = (line: string) => available - stringWidth(line)

    return pipe(
      lines,
      Array.map(line => {
        const Δ = computeΔ(line)
        return Δ <= 0 ? line : expand(pad, align, Δ)(line)
      }),
    )
  }

// Expand a line to fill available space according to given alignment.
function expand(pad: string, alignment: HorizontalAlignment, Δ: number) {
  return (line: string) =>
    pipe(
      alignment,
      matchHorizontal(
        () => line + padN(pad, Δ),
        () => {
          const [quotient, remainder] = floorMod2(Δ)
          return padN(pad, quotient) + line + padN(pad, quotient + remainder)
        },
        () => padN(pad, Δ) + line,
      ),
    )
}

// Return the padding string at the required width. To fit the width
// we either repeat and/or crop the padding.
function padN(pad: string, available: number): string {
  const padWidth = stringWidth(pad)
  if (available <= padWidth) return pad.slice(0, available)

  const [quotient, remainder] = floorMod(available, padWidth)
  return (
    pipe(pad, String.repeat(quotient)) +
    (remainder === 0 ? '' : pad.slice(0, remainder))
  )
}
