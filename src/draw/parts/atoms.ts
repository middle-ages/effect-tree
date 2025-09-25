import {Array, pipe} from '#util'
import {type EndoOf, dual} from '#Function'
import {
  type Part,
  column as columnPart,
  empty as emptyPart,
  row as rowPart,
  text as textPart,
} from '../part.js'
import type {DirectedPad} from './pad.js'

/**
 * A zero-width single line height part.
 * @category drawing
 */
export const emptyTextPart: Part = textPart('')

/**
 * A text part that joins the given string list horizontally, separating items
 * using the given separator.
 * @example
 * import {Draw} from 'effect-tree'
 * const {drawPart, joinText} = Draw
 *
 * const part = joinText(['A', 'B', 'C'], '.')
 *
 * console.log(drawPart(part))
 * // ‘A.B.C’
 * @category drawing
 * @function
 */
export const joinText: {
  (xs: string[], separator?: string): Part
  (separator?: string): (xs: string[]) => Part
} = dual(
  2,
  (xs: string[], separator?: string): Part =>
    pipe(xs, Array.join(separator ?? ''), textPart),
)

const _stackText = (xs: string[]): Part =>
  pipe(xs, Array.map(textPart), columnPart.center)

/**
 * A column part that joins the given string list vertically.
 *
 * At the key `rest` you will find a version that accepts the strings as a list
 * of arguments.
 * @example
 * import {Draw} from 'effect-tree'
 * const {drawPart, stackText} = Draw
 *
 * console.log(drawPart(stackText.rest('A', 'B', 'C')).join('\n'))
 * // ‘A
 * //  B
 * //  C’
 * @category drawing
 * @function
 */
export const stackText = Object.assign(_stackText, {
  rest: (...xs: string[]): Part => _stackText(xs),
})

stackText.rest = (...xs: string[]): Part => stackText(xs)

/**
 * A text part that is `width` wide composed entirely of the given string
 * repeated or sliced.
 * @example
 * import {Draw} from 'effect-tree'
 * const {drawPart, repeatText} = Draw
 *
 * console.log(drawPart(repeatText(3, 'A')))
 * // ‘AAA’
 * @category drawing
 * @function
 */
export const repeatText: {
  (width: number, repeat: string): Part
  (repeat: string): (width: number) => Part
} = dual(
  2,
  (width: number, repeat: string): Part =>
    width === 0 ? emptyPart : pipe(repeat, Array.replicate(width), joinText()),
)

/**
 * Returns the empty part if the given height is zero, else a zero-width column
 * at the given height.
 * @example
 * import {Draw} from 'effect-tree'
 * const {vIndent, drawPart} = Draw
 *
 * console.log(drawPart(vIndent(2)).join('\n'))
 * // ‘
 * // ’
 * console.log(drawPart(vIndent(0)).join('\n'))
 * // ‘’
 * @category drawing
 * @function
 */
export const vIndent = (height: number): Part =>
  height === 0
    ? emptyPart
    : pipe(emptyTextPart, Array.replicate(height), columnPart.center)

/**
 * Pad a part with left and right padding filled with the optional padding, by
 * default the space character.
 *
 * At the keys `left` and  `right` you will find versions that pad only a single
 * side of the given part.
 * @category drawing
 * @function
 */
export const hSpace = Object.assign(
  (fillLeft = ' ', fillRight = ' ') =>
    (padLeft = 1, padRight = padLeft): EndoOf<Part> =>
    self =>
      rowPart.middle.center([
        repeatText(padLeft, fillLeft),
        self,
        repeatText(padRight, fillRight),
      ]),
  {
    left:
      (fillLeft = ' ', padLeft = 0): EndoOf<Part> =>
      (self: Part): Part =>
        rowPart.middle.center([repeatText(padLeft, fillLeft), self]),
    right:
      (fillRight = ' ', padRight = 0): EndoOf<Part> =>
      (self: Part): Part =>
        rowPart.middle.center([self, repeatText(padRight, fillRight)]),
  },
)

/**
 * Pad a part with top and bottom padding filled with spaces.
 *
 * At the keys `top` and  `bottom` you will find versions that pad only a single
 * side of the given part.
 * @category drawing
 * @function
 */
export const vSpace = Object.assign(
  (padTop = 1, padBottom = padTop): EndoOf<Part> =>
    self =>
      columnPart.center([vIndent(padTop), self, vIndent(padBottom)]),
  {
    top: (self: Part, pad = 0): Part => columnPart.center([vIndent(pad), self]),
    bottom: (self: Part, pad = 0): Part =>
      columnPart.center([self, vIndent(pad)]),
  },
)

/**
 * Pad a part with spaces in all directions.
 * @category drawing
 * @function
 */
export const spacePad: {
  (self: Part, pad: Partial<DirectedPad>): Part
  ({top, right, bottom, left}: Partial<DirectedPad>): EndoOf<Part>
} = dual(
  2,
  (self: Part, {top, right, bottom, left}: Partial<DirectedPad>): Part =>
    pipe(self, vSpace(top, bottom), hSpace()(left, right)),
)
