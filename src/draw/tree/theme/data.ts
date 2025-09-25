import {Array, Number, Record, pipe} from '#util'
import {dual, identity, type EndoOf} from '#Function'
import {text, type Part} from '../../part.js'
import {type GlyphRole} from './glyph.js'
import type {Theme} from './types.js'

/**
 * Get a glyph by role from a tree theme.
 * @param role - Glyph role to get.
 * @param theme - Theme to query.
 * @category drawing
 * @function
 */
export const getGlyph: {
  (role: GlyphRole, theme: Theme): string
  (theme: Theme): (role: GlyphRole) => string
} = dual(2, (role: GlyphRole, {glyphs}: Theme): string => glyphs[role])

/**
 * Get a glyph by role from a tree theme.
 * @param theme - Theme to query.
 * @returns Theme indents.
 * @category drawing
 * @function
 */
export const getGlyphPart: {
  (role: GlyphRole, theme: Theme): Part
  (theme: Theme): (role: GlyphRole) => Part
} = dual(
  2,
  (role: GlyphRole, theme: Theme): Part => text(getGlyph(role, theme)),
)

/**
 * Get the indent count of a tree theme.
 * @param theme - Theme to query.
 * @returns Theme indents.
 * @category drawing
 * @function
 */
export const getIndents = ({indents}: Theme): number => indents

/**
 * Get the vertical spacing of a tree theme.
 * @param theme - Theme to query.
 * @returns Theme vertical spacing.
 * @category drawing
 * @function
 */
export const getSpacing = ({spacing}: Theme): number => spacing

/**
 * Get the string formatter of the tree theme.
 * @param theme - Theme to query.
 * @returns Theme formatter.
 * @category drawing
 * @function
 */
export const getFormatter = ({formatter}: Theme): EndoOf<string> => formatter

/**
 * Set the `formatter` of a theme.
 * @param formatter - New formatter.
 * @returns Theme with updated formatter.
 * @category drawing
 * @function
 */
export const setFormatter: (formatter: EndoOf<string>) => EndoOf<Theme> =
  set('formatter')

/**
 * Set the indent count of a tree theme.
 * @param indents - Number of indents from parent to child.
 * @returns Theme with updated indent count.
 * @category drawing
 * @function
 */
export const setIndents: (indents: number) => EndoOf<Theme> = set('indents')

/**
 * Set the vertical spacing of a tree theme.
 * @param spacing - Number of lines of vertical space between tree nodes.
 * @returns Theme with updated vertical spacing.
 * @category drawing
 * @function
 */
export const setSpacing: (spacing: number) => EndoOf<Theme> = set('spacing')

/**
 * Increment tree theme indents by the given count, by default `1`.
 * @param increment - Number of characters to add to the theme indent count.
 * @returns Theme with updated vertical spacing.
 * @category drawing
 * @function
 */
export const incrementIndents = (increment = 1): EndoOf<Theme> =>
  pipe(increment, Number.sum, modIndents)

/**
 * Decrement tree theme indents by the given count, by default `1`. If the
 * indent count is zero the theme is return unchanged.
 * @param decrement - Number of characters to remove from the theme indent count.
 * @returns Theme with updated vertical spacing.
 * @category drawing
 * @function
 */
export const decrementIndents =
  (decrement = 1): EndoOf<Theme> =>
  theme =>
    pipe(
      theme,
      getIndents(theme) === 0 ? identity : incrementIndents(-1 * decrement),
    )

/**
 * Increment tree theme spacing by the given count, by default `1`.
 * @param increment - Number of vertical lines to add to the theme spacing.
 * @returns Theme with updated vertical spacing.
 * @category drawing
 * @function
 */
export const incrementSpacing = (increment = 1): EndoOf<Theme> =>
  pipe(increment, Number.sum, modSpacing)

/**
 * Decrement tree theme spacing by the given count, by default `1`. If the
 * spacing is at zero the theme is returned unchanged.
 * @param decrement - Number of vertical lines to remove from the theme spacing.
 * @returns Theme with updated vertical spacing.
 * @category drawing
 * @function
 */
export const decrementSpacing =
  (decrement = 1): EndoOf<Theme> =>
  theme =>
    pipe(
      theme,
      getSpacing(theme) === 0 ? identity : incrementSpacing(-1 * decrement),
    )

/**
 * Returns a list of newlines that is the size of the tree theme vertical
 * spacing setting minus one.
 * @param theme - Tree theme to query for spacing.
 * @returns An array of single newlines. Newline count will be equal to theme spacing.
 * @category drawing
 * @function
 */
export const fillSpacing = ({spacing}: Theme): string[] =>
  Array.replicate(spacing - 1)('\n')

/**
 * Modify the indent count of a tree theme using the given function.
 * @param f - Will be given the indent count and expected to return an updated value.
 * @category drawing
 * @function
 */
export function modIndents(f: EndoOf<number>): EndoOf<Theme> {
  return modTheme('indents')(f)
}

/**
 * Modify the vertical spacing of a tree theme using the given function.
 * @param f - Will be given the vertical spacing and expected to return an updated value.
 * @category drawing
 * @function
 */
export function modSpacing(f: EndoOf<number>): EndoOf<Theme> {
  return modTheme('spacing')(f)
}

/**
 * Modify the formatter function of a tree theme using the given function.
 * @param f - Will be given the formatter function and expected to return an updated value.
 * @category drawing
 * @function
 */
export function modFormatter(f: EndoOf<EndoOf<string>>): EndoOf<Theme> {
  return modTheme('formatter')(f)
}

function modTheme<Field extends keyof Theme>(key: Field) {
  return (f: EndoOf<Theme[Field]>): EndoOf<Theme> =>
    theme => ({
      ...theme,
      ...Record.singleton(key, f(theme[key])),
    })
}

function set<Field extends keyof Theme>(key: Field) {
  return (value: Theme[Field]): EndoOf<Theme> => modTheme(key)(() => value)
}
