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

const _joinText = (xs: string[], separator?: string): Part =>
  pipe(xs, Array.join(separator ?? ''), textPart)

/**
 * A text part that joins the given string list horizontally, separating items
 * using the given separator.
 *
 * At the key `curried` you will find a curried version that takes the optional
 * separator as first argument.
 * @example
 * import {Draw} from 'effect-tree'
 * const {drawPart, joinText} = Draw
 *
 * const part = joinText(['A', 'B', 'C'], '.')
 *
 * expect(drawPart(part)).toEqual(['A.B.C'])
 * @category drawing
 * @function
 */
export const joinText: {
  (xs: string[], separator?: string): Part
  curried: (separator?: string) => (xs: string[]) => Part
} = Object.assign(_joinText, {
  curried:
    (separator?: string) =>
    (xs: string[]): Part =>
      _joinText(xs, separator),
})

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
 * const part = stackText.rest('A', 'B', 'C')
 *
 * expect(drawPart(part)).toEqual([
 *   'A',
 *   'B',
 *   'C',
 * ])
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
 * const part = repeatText(3, 'A')
 *
 * expect(drawPart(part)).toEqual(['AAA'])
 * @category drawing
 * @function
 */
export const repeatText: {
  (width: number, repeat: string): Part
  (repeat: string): (width: number) => Part
} = dual(
  2,
  (width: number, repeat: string): Part =>
    width === 0 ? emptyPart : pipe(repeat, Array.replicate(width), joinText),
)

/**
 * Returns the {@link empty | empty part} if the given height is zero, else a
 * zero-width column at the given height.
 * @example
 * import {Draw} from 'effect-tree'
 * const {vIndent, drawPart} = Draw
 *
 * expect(drawPart(vIndent(2))).toEqual(['', ''])
 * expect(drawPart(vIndent(0))).toEqual([])
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
 * @example
 * import {Draw} from 'effect-tree'
 * const {drawPart, hSpace, text} = Draw
 *
 * const part = text('foo')
 *
 * const padded = hSpace('←', '→')(1, 2)(part)
 *
 * expect(drawPart(padded)).toEqual(['←foo→→'])
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
 * @example
 * import {Draw} from 'effect-tree'
 * const {drawPart, vSpace, text} = Draw
 *
 * const part = text('foo')
 *
 * const padded = vSpace(1)(part)
 *
 * expect(drawPart(padded)).toEqual([
 *   '   ',
 *   'foo',
 *   '   ',
 * ])
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
 * @example
 * import {Draw} from 'effect-tree'
 * const {drawPart, spacePad, text} = Draw
 *
 * const part = text('foo')
 *
 * const padded = spacePad(
 *   part,
 *   {top: 1, right: 1, bottom: 1, left: 1},
 * )
 *
 * expect(drawPart(padded)).toEqual([
 *   '     ',
 *   ' foo ',
 *   '     ',
 * ])
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
