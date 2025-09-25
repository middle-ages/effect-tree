import {map, type Tree} from '#tree'
import {String, Function} from '#util'
import {flow, identity, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {drawPart} from '../part.js'
import {treeLayout} from './layout.js'
import {
  type Theme,
  getTheme,
  mapThemes,
  type ThemeName,
  formatNodes,
} from './theme.js'

/**
 * Type of the base draw function: draw a tree into some output format.
 *
 * A function of the type:
 *
 * ```ts
 *{ (self: Tree<A>): Out }
 * ```
 * @typeParam A Underlying type of the tree being printed.
 * @typeParam Out Output type of drawing function. Usually multiline string or * array of string lines for terminal output.
 * @category drawing
 */
export interface BaseDraw<A, Out> {
  (self: Tree<A>): Out
}

/**
 * A function that draws string trees into a non-empty array of string rows.
 * Defined as {@link BaseDraw} fixed on `string` input and on output of
 * `NonEmptyArray<string>`.
 *
 * A function of the type:
 *
 * ```ts
 * { (self: Tree<string>): NonEmptyArray<string> }
 * ```
 * @category drawing
 */
export interface StringDraw extends BaseDraw<string, NonEmptyArray<string>> {}

/**
 * Type of the unlines draw function: a {@link BaseDraw} that outputs to a
 * non-empty array of strings, and has a variant under the `unlines` key.
 *
 * At the key `unlines` you will find a version that draws to a `string` instead
 * of a `NonEmptyArray<string>` by joining the rows with newlines.
 *
 * A function of the type:
 *
 * ```ts
 * {
 *   (self: Tree<A>): NonEmptyArray<string>
 *   unlines: (self: Tree<A>) ⇒ NonEmptyArray<string>
 * }
 * ```
 * @typeParam A Underlying type of the tree being printed.
 * @category drawing
 */
export interface UnlinesDraw<A> extends BaseDraw<A, NonEmptyArray<string>> {
  unlines: BaseDraw<A, string>
}

/**
 * Type of the enriched draw function: an {@link UnlinesDraw} for strings, with
 * another version of the very same {@link UnlinesDraw} at the key `number`
 * specialized for numeric trees.
 *
 * A function of the type:
 *
 * ```ts
 * {
 *   (self: Tree<string>): NonEmptyArray<string>
 *   unlines: (self: Tree<string>) ⇒ string
 *   number: {
 *     (self: Tree<number>) ⇒ NonEmptyArray<string>
 *     unlines: (self: Tree<number>) ⇒ string
 *   }
 * }
 * ```
 * @category drawing
 */
export interface EnrichedDraw extends UnlinesDraw<string> {
  number: UnlinesDraw<number>
}

/**
 * Type of the {@link drawTree} function: exactly like {@link EnrichedDraw} but
 * adds a key per theme name with another {@link EnrichedDraw} as the value.
 *
 * A function of the type:
 *
 * ```ts
 * {
 *     (self: Tree<string>): NonEmptyArray<string>
 *     unlines: (self: Tree<string>) ⇒ string
 *     number: {
 *       (self: Tree<number>) ⇒ NonEmptyArray<string>
 *       unlines: (self: Tree<number>) ⇒ string
 *     }
 * } & Record<ThemeName, EnrichedDraw>
 * ```
 * @category drawing
 */
export interface DrawTree
  extends EnrichedDraw,
    Record<ThemeName, EnrichedDraw> {}

const _themedTree = (self: Tree<string>, theme: Theme) =>
  pipe(
    self,
    formatNodes(theme),
    treeLayout.flip(theme),
    drawPart,
  ) as NonEmptyArray<string>

/**
 * Draw a tree as a 2D array of glyphs in the given theme.
 *
 * At the key `unlines` you will find a version that joins output into a string.
 *
 * You can get themes by name using the {@link getTheme | getTheme function}.
 * @category drawing
 * @function
 */
export const themedTree: {
  (self: Tree<string>, theme: Theme): NonEmptyArray<string>
  (theme: Theme): (self: Tree<string>) => NonEmptyArray<string>
  unlines: (theme: Theme) => (self: Tree<string>) => string
} = Object.assign(Function.dual(2, _themedTree), {
  unlines: (theme: Theme) => (self: Tree<string>) =>
    String.unlines(_themedTree(self, theme)),
})

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
 * import {of, drawTree} from 'effect-tree'
 *
 * const stringTree = of('foo')
 * const numericTree = of(42)
 *
 * // Draw a string tree into arrays of rows using default theme.
 * console.log(drawTree(stringTree))
 *
 * // Draw a numeric tree into arrays of rows using default theme.
 * console.log(drawTree.number(numericTree))
 *
 * // Draw string trees to a string using default theme for `console.log`, for
 * // example.
 * console.log(drawTree.unlines(stringTree))
 *
 * // Draw numeric trees to a string using default theme.
 * console.log(drawTree.number.unlines(numericTree))
 *
 * // Draw string trees using a specific theme into rows.
 * console.log(drawTree.ascii(stringTree))
 *
 * // Draw string trees using a specific theme into a string.
 * console.log(drawTree.ascii.unlines(stringTree))
 *
 * // Draw numeric trees using a specific theme into rows.
 * console.log(drawTree.ascii.number(numericTree))
 *
 * // Draw numeric trees using a specific theme into a string.
 * console.log(drawTree.ascii.number.unlines(numericTree))
 * @category drawing
 * @function
 */
export const drawTree: DrawTree = Object.assign(
  enrichedDraw('thin'),
  mapThemes((_, name) => enrichedDraw(name)),
)

/**
 * @category internal
 * @function
 */
export function enrichedDraw(themeName: ThemeName): EnrichedDraw {
  return Object.assign(unlinesDraw<string>(themeName, identity), {
    number: unlinesDraw<number>(themeName, String.fromNumber),
  })
}

function unlinesDraw<A>(
  themeName: ThemeName,
  converter: (a: A) => string,
): UnlinesDraw<A> {
  return Object.assign(baseDraw(themeName, converter), {
    unlines: flow(baseDraw(themeName, converter), String.unlines),
  })
}

function baseDraw<A>(
  themeName: ThemeName,
  converter: (a: A) => string,
): BaseDraw<A, NonEmptyArray<string>> {
  return flow(map(converter), pipe(themeName, getTheme, themedTree))
}
