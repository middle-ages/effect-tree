import {map, type Tree} from '#tree'
import {String} from '#util'
import {flow, identity, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {drawPart} from '../part.js'
import {treeLayout} from './layout.js'
import {type Theme} from './theme.js'
import {getTheme, mapThemes, type ThemeName} from './themes.js'

/**
 * Type of the base draw function: draw a tree into some output format.
 * @category drawing
 */
export interface BaseDraw<A, Out> {
  (self: Tree<A>): Out
}

/**
 * A function that draws string trees into a non-empty array of string rows.
 * @category drawing
 */
export interface StringDraw extends BaseDraw<string, NonEmptyArray<string>> {}

/**
 * Draw a tree as a 2D array of glyphs in the given theme.
 * @category drawing
 */
export const themedTree = (theme: Theme) => (self: Tree<string>) =>
  pipe(self, treeLayout.flip(theme), drawPart) as NonEmptyArray<string>

/**
 * Type of the {@link drawTree} function: an {@link EnrichedDraw}  with an
 * {@link UnlinesDraw} at each key named after a
 * {@link themeNames | theme name}.
 * @category drawing
 */
export interface DrawTree
  extends EnrichedDraw,
    Record<ThemeName, EnrichedDraw> {}

/**
 * Draw a string or numeric tree into a non-empty array of string rows.
 *
 * At the key `unlines` you will find a version the returns a string of the
 * joined rows.
 *
 * At the key `numeric` you will find a version that draws _numeric_ trees, and
 * it too has a key `unlines` with a version that draws to strings rather than
 * an array of rows.
 *
 * At each key named after a {@link themeNames | theme name}, you will find a
 * version of the function with its `numeric` and `unlines` variants, that draws
 * the tree at the given theme.
 * @example
 * import {Array} from 'effect'
 * import {drawTree} from 'effect-tree'
 *
 * const stringTree = of('foo')
 * const numericTree = of(42)
 *
 * // Draw a string tree into arrays of rows using default theme.
 * const stringRows : Array.NonEmptyArray<string> = drawTree(stringTree)
 *
 * // Draw a numeric tree into arrays of rows using default theme.
 * const numericRows: Array.NonEmptyArray<string> = drawTree.number(numericTree)
 *
 * // Draw string trees to a string using default theme for `console.log`, for
 * // example.
 * console.log(drawTree.unlines(stringTree))
 *
 * // Draw numeric trees to a string using default theme.
 * console.log(drawTree.numeric.unlines(numericTree))
 *
 * // Draw string trees using a specific theme into rows.
 * const stringAsciiRows = drawTree.ascii(stringTree))
 *
 * // Draw string trees using a specific theme into a string.
 * console.log(drawTree.ascii.unlines(stringTree))
 *
 * // Draw numeric trees using a specific theme into rows.
 * const numericAsciiRows = drawTree.ascii.numeric(numericTree))
 *
 * // Draw numeric trees using a specific theme into a string.
 * console.log(drawTree.ascii.numeric.unlines(numericTree))
 *
 * @param tree The string or numeric tree to be drawn.
 * @category drawing
 */
export const drawTree: DrawTree = Object.assign(
  enrichedDraw('thin'),
  mapThemes((_, name) => enrichedDraw(name)),
)

/**
 * Type of the enriched draw function: an {@link UnlinesDraw} for strings, with
 * another version of {@link UnlinesDraw} at the key `number` specialized
 * for numeric trees.
 * @category drawing
 */
export interface EnrichedDraw extends UnlinesDraw<string> {
  number: UnlinesDraw<number>
}

/**
 * @category internal
 */
export function enrichedDraw(themeName: ThemeName): EnrichedDraw {
  return Object.assign(unlinesDraw<string>(themeName, identity), {
    number: unlinesDraw<number>(themeName, String.fromNumber),
  })
}

/**
 * Type of the unlines draw function: a {@link BaseDraw} with `unlines`.
 *
 * At the key `unlines` you will find a version that draws to a `string` instead
 * of a `NonEmptyArray<string>` by joining the rows with newlines.
 * @category drawing
 */
export interface UnlinesDraw<A> extends BaseDraw<A, NonEmptyArray<string>> {
  unlines: BaseDraw<A, string>
}

function unlinesDraw<A>(
  themeName: ThemeName,
  formatter: (a: A) => string,
): UnlinesDraw<A> {
  return Object.assign(baseDraw(themeName, formatter), {
    unlines: flow(baseDraw(themeName, formatter), String.unlines),
  })
}

function baseDraw<A>(
  themeName: ThemeName,
  formatter: (a: A) => string,
): BaseDraw<A, NonEmptyArray<string>> {
  return flow(map(formatter), pipe(themeName, getTheme, themedTree))
}
