import {Array, pipe, Record} from 'effect'
import {glyphMap, glyphRoles} from './glyph.js'

export const themeNames = [
  'ascii',
  'bullets',
  'rounded',
  'space',
  'thick',
  'doubleSpaceThin',
  'thin',
  'unix',
  'unixRounded',
] as const

/**
 * A builtin theme name.
 * @category drawing
 */
export type ThemeName = (typeof themeNames)[number]

/**
 * A role for a glyph in a glyph role map.
 * @category drawing
 */
export type GlyphRole = (typeof glyphRoles)[number]

/**
 * A glyph role mapping roles to glyphs.
 * @category drawing
 */
export type GlyphRoleMap = Record<GlyphRole, string>

/**
 * Type of the theme map. Maps theme name to theme.
 * @category drawing
 */
export type ThemeMap = Record<ThemeName, Theme>

/**
 * Everything required to theme a part.
 * @category drawing
 */
export interface Theme {
  /**
   * The number of empty lines added between vertical nodes. A higher
   * number increases table vertical spacing between nodes.
   */
  spacing: number

  /**
   * The number of times that the theme glyphs for the role `indent`
   * will be repeated when indenting a part. Higher numbers increase
   * the horizontal space between tree levels.
   */
  indents: number

  /**
   * A map of glyph role to glyphs that will be used to compose
   * the tree.
   */
  glyphs: GlyphRoleMap
}

/**
 * Theme constructor.
 * @category drawing
 */
const theme = ({
  spacing = 0,
  indents = 0,
  glyphs = glyphMap['thin'],
}: Partial<Theme>): Theme => ({spacing, indents, glyphs})

const thin = theme({glyphs: glyphMap['thin']})

/**
 * Maps of theme name to theme.
 * @category drawing
 */
export const themes = {
  space: theme({indents: 1, glyphs: glyphMap['space']}),
  bullets: theme({indents: 1, glyphs: glyphMap['bullets']}),
  thin,
  doubleSpaceThin: {...thin, spacing: 1, indents: 1},
  thick: theme({glyphs: glyphMap['thick']}),
  rounded: theme({glyphs: glyphMap['rounded']}),
  ascii: theme({indents: 1, glyphs: glyphMap['ascii']}),
  unix: theme({glyphs: glyphMap['unix']}),
  unixRounded: theme({glyphs: glyphMap['unixRounded']}),
} satisfies ThemeMap

/**
 * Run a function that requires a theme.
 * @category drawing
 */
export const themed = <A>(f: (theme: Theme) => A): typeof f => f

/**
 * Map over all themes to build a record theme `name` ⇒ `f(theme)`.
 * @category drawing
 */
export const mapThemes = <A>(
  f: (theme: Theme, name: ThemeName) => A,
): Record<ThemeName, A> =>
  pipe(
    themeNames,
    Array.map(name => [name, f(themes[name], name)] as [ThemeName, A]),
    Record.fromEntries,
  )
