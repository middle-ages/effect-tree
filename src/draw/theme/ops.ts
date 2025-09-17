import {flipCurried} from '#util/Function'
import {Array, flow, Function, pipe} from 'effect'
import type {NonEmptyArray, NonEmptyReadonlyArray} from 'effect/Array'
import * as PR from '../part.js'
import type {HorizontalAlignment, VerticalAlignment} from '../part/align.js'
import type {Text} from '../part/partF.js'
import type {Part, Row} from '../part/types.js'
import {getGlyph} from './get.js'
import {themed, type GlyphRole, type Theme} from './themes.js'
import type {Themed} from './types.js'

/**
 * @category drawing
 */
export const themedGlyph = flipCurried(getGlyph),
  themedSpaceGlyph = themedGlyph('space')

/**
 * @category drawing
 */
export const themedTextGlyph = (glyphRole: GlyphRole): Themed<Text> =>
  flow(themedGlyph(glyphRole), PR.text)

/**
 * @category drawing
 */
export const themedSpace = (theme: Theme): PR.PartF.Text =>
  pipe(theme, themedSpaceGlyph, PR.text)

/**
 * @category drawing
 */
export const themedRow: (
  va: Themed<VerticalAlignment>,
) => Themed<
  (
    a: HorizontalAlignment,
  ) => (
    cells: Part[],
    [hStrut, vStrut]?: [hStrut: Text, vStrut?: NonEmptyArray<Text>],
  ) => Row
> = flipCurried(liftThemed(PR.row))

/**
 * @category drawing
 */
export const drawThemed: Themed<(part: Themed<Part>) => string[]> = themed(
  theme => part => pipe(theme, part, PR.draw),
)

/**
 * @category drawing
 */
export const foreachThemed = <A>(
  xs: NonEmptyReadonlyArray<Themed<A>>,
): Themed<NonEmptyArray<A>> =>
  themed(theme => Array.map(xs, Function.apply(theme)))

/**
 * Apply a function from `A` to `B` to get at the `B`, using a themed value of
 * `A` and a theme.
 * @category drawing
 */
export function liftThemed<A, B>(f: (a: A) => B): Themed<(ta: Themed<A>) => B> {
  return themed(theme => (ta: Themed<A>) => pipe(theme, ta, f))
}
