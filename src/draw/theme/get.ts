import {type EndoOf} from '#util/Function'
import {pluck} from '#util/Record'
import {prefix, suffix} from '#util/String'
import {pipe, String} from 'effect'
import {
  themed,
  themes,
  type GlyphRole,
  type GlyphRoleMap,
  type Theme,
  type ThemeName,
} from './themes.js'
import type {Themed} from './types.js'

/**
 * Get a theme from the global theme dictionary by name.
 * @param name - The theme name is taken from {@link themeNames}.
 * @returns The named theme.
 * @category drawing
 */
export const getTheme = (name: ThemeName): Theme => themes[name]

/**
 * Get the numeric spacing of a theme.
 * @param theme - The {@link Theme} to query.
 * @returns Inter-line spacing configured for the given theme.
 * @category drawing
 */
export const getSpacing: Themed<number> = themed(pluck('spacing'))

/**
 * Get the numeric indents configuration of a theme.
 * @param theme - The {@link Theme} to query.
 * @returns Indents the theme adds per tree level.
 * @category drawing
 */
export const getIndents: Themed<number> = themed(pluck('indents'))

/**
 * Get the {@link GlyphRoleMap} defined for the theme. It defines the mapping
 * between glyph _roles_ and actual glyphs. Authors of
 * {@link ThemedPart}s access glyphs by role from this dictionary, which allows
 * the theme to configure the actual glyphs used for each role.
 * @param theme - The {@link Theme} to query.
 * @returns The dictionary of glyph roles to glyphs.
 * @category drawing
 */
export const getGlyphMap: Themed<GlyphRoleMap> = themed(pluck('glyphs'))

/**
 * Get from the theme the glyph associated with a {@link GlyphRole}.
 * @param theme - The {@link Theme} to query.
 * @returns The correct glyph.
 * @category drawing
 */
export const getGlyph = themed(
  theme =>
    /** The {@link GlyphRole} required. */
    (role: GlyphRole): string =>
      getGlyphMap(theme)[role],
)

/**
 * Given a {@link Theme} and a {@link GlyphRole}, returns a function that will
 * prefix a string with the correct glyph.
 * @param theme - The {@link Theme} to use.
 * @returns The prefixed string.
 * @category drawing
 */
export const prefixGlyph = themed(
  theme =>
    /** The {@link GlyphRole} required. */
    (role: GlyphRole): EndoOf<string> =>
    /** The string to prefix with the glyph. */
    s =>
      pipe(role, getGlyph(theme), suffix(s)),
)

/**
 * Given a {@link Theme} and a {@link GlyphRole}, returns a function that will
 * suffix a string with the correct glyph.
 * @param theme - The {@link Theme} to use.
 * @returns The suffixed string.
 * @category drawing
 */
export const suffixGlyph = themed(
  theme =>
    /** The {@link GlyphRole} required. */
    (role: GlyphRole): EndoOf<string> =>
    /** The string to suffix with the glyph. */
    s =>
      pipe(role, getGlyph(theme), prefix(s)),
)

/**
 * Given a {@link GlyphRole} as a _prefix_, and another one for _indents_,
 * returns a string that starts with the glyph from the prefix role,
 * and fills the size of the {@link Theme} `indents` field with a
 * glyph of the role given in `indentRole`.
 * @param prefixRole - The  {@link GlyphRole} that will prefix the indent.
 * @param indentRole - The {@link GlyphRole} that will be used to fill the indent space.
 * @returns The joined string.
 * @category drawing
 */
export const indentGlyph =
  (prefixRole: GlyphRole, indentRole: GlyphRole): Themed<string> =>
  theme => {
    const glyph = getGlyph(theme)
    return (
      glyph(prefixRole) +
      pipe(indentRole, glyph, String.repeat(getIndents(theme)))
    )
  }
