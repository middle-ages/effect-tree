import {Array, pipe} from '#util'
import {type EndoOf} from '#util/Function'
import {type BorderSet} from '../glyph.js'
import {above, after, before, below, text, type Part} from '../part.js'
import {HStrut, Struts, VStrut} from '../struts.js'
import {emptyTextPart} from './atoms.js'

/**
 * Type of functions that modify a part with the help of some {@link BorderSet}.
 * @category drawing
 */
export interface Bordered {
  (set: BorderSet): EndoOf<Part>
}

/**
 * Add a border to the top of the given shape with no corners.
 * The glyph is taken from the given {@link BorderSet}.
 *
 * At the key `corners` you will find a version that has the same signature but
 * _does_ add the required top left and top right right corners.
 * @category drawing
 */
export const borderTop: Bordered & {corners: Bordered} = Object.assign(
  ({lines: {top}}: BorderSet): EndoOf<Part> =>
    below.center(emptyTextPart, HStrut([top])),
  {
    corners: ({
      lines: {top},
      elbows: {topLeft, topRight},
    }: BorderSet): EndoOf<Part> =>
      below.left(emptyTextPart, HStrut([top], topLeft, topRight)),
  },
)

/**
 * Add a border to the right of the given shape with no corners.
 * The glyph is taken from the given {@link BorderSet}.
 * @category drawing
 */
export const borderRight: Bordered =
  ({lines: {right}}: BorderSet): EndoOf<Part> =>
  part =>
    pipe(part, before.middle.center(text(right), Struts(VStrut([right]))))

/**
 * Add a border to the top of the given shape with no corners.
 * The glyph is taken from the given {@link BorderSet}.
 *
 * At the key `corners` you will find a version that has the same signature but
 * _does_ add the required bottom left and bottom right corners.
 * @category drawing
 */
export const borderBottom: Bordered & {corners: Bordered} = Object.assign(
  ({lines: {bottom}}: BorderSet): EndoOf<Part> =>
    above.center(emptyTextPart, HStrut([bottom])),
  {
    corners: ({
      lines: {bottom},
      elbows: {bottomLeft, bottomRight},
    }: BorderSet): EndoOf<Part> =>
      above.right(emptyTextPart, HStrut([bottom], bottomLeft, bottomRight)),
  },
)

/**
 * Add a border to the left of the given shape with no corners.
 * The glyph is taken from the given {@link BorderSet}.
 * @category drawing
 */
export const borderLeft: Bordered =
  ({lines: {left}}) =>
  part =>
    pipe(part, after.middle.center(text(left), Struts(VStrut([left]))))

/**
 * Add borders to the left and right of the given part.
 * @category drawing
 */
export const hBorders: Bordered = set => part =>
  pipe(part, borderLeft(set), borderRight(set))

/**
 * Add borders to the top and bottom of the given part.
 *
 * At the key `corners` you will find a version that has the same signature but
 * adds corner glyphs at the left and right edges of th top and bottom borders.
 * @category drawing
 */
export const vBorders = Object.assign(
  (set: BorderSet): EndoOf<Part> =>
    part =>
      pipe(part, borderTop(set), borderBottom(set)),
  {
    corners:
      (set: BorderSet): EndoOf<Part> =>
      part =>
        pipe(part, borderTop.corners(set), borderBottom.corners(set)),
  },
)

const _addBorder = (self: Part, set: BorderSet): Part =>
  pipe(self, hBorders(set), vBorders.corners(set))

/**
 * Add a border around the given shape. The line and elbow glyphs are taken from
 * the given set.
 *
 * At the key `curried` you will find a curried version that takes the border
 * set as its first argument.
 * @category drawing
 */
export const addBorder: {
  (self: Part, set: BorderSet): Part
  curried: (set: BorderSet) => EndoOf<Part>
} = Object.assign(_addBorder, {
  curried:
    (set: BorderSet): EndoOf<Part> =>
    self =>
      _addBorder(self, set),
})

const _addBorders =
  ([head, ...tail]: Array.NonEmptyArray<BorderSet>): EndoOf<Part> =>
  self =>
    pipe(tail, Array.reduce(pipe(self, addBorder.curried(head)), addBorder))

/**
 * Add a non-empty list of borders iteratively, wrapping each border _around_ the
 * previous one so that the end result is a nesting of borders with the 1st border
 * being the innermost border and the last the outermost.
 *
 * At the `rest` key you will find version that accepts the borders as
 * arguments.
 * @param sets - A non-empty list of border sets that will be nested around the given part.
 * @category drawing
 */
export const addBorders = Object.assign(_addBorders, {
  rest:
    (...sets: Array.NonEmptyArray<BorderSet>): EndoOf<Part> =>
    self =>
      _addBorders(sets)(self),
})
