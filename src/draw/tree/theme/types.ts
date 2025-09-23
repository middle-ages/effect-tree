import {identity} from '#util/Function'
import {type Part} from '../../part.js'
import {glyphSet, type GlyphSet, type GlyphSetName} from './glyph.js'

/**
 * Names of themes created with an indent count of zero.
 * @category internal
 */
export const noIndentThemes = [
  'thin',
  'thick',
  'hThick',
  'vThick',
  'unix',
  'unixRound',
  'round',
  'double',
  'hDouble',
  'vDouble',
] as const

/**
 * Names of themes sets created with an indent count of one.
 * @category internal
 */
export const indentedThemes = ['ascii', 'bullets', 'space'] as const

/**
 * Names of glyph sets created with an indent count of one.
 * @category drawing
 */
export const themeNames = [...noIndentThemes, ...indentedThemes] as const

/**
 * Type of theme names.
 * @category drawing
 */
export type ThemeName = GlyphSetName

/**
 * Type of theme registry mapping theme names to themes.
 * @category drawing
 */
export type ThemeMap = Record<ThemeName, Theme>

/*
 * A _tree theme_ maps drawing roles to actual glyphs and styles. For example, a
 * theme could map the glyph role `top-left-elbow`, used when you need an elbow
 * shape pointing top-left, to the glyph `┌`, while another could map it to the
 * glyph `╭`.
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
  glyphs: GlyphSet

  /** The formatting function can change the tree label before it is drawn. */
  formatter: (node: string) => string
}

/**
 * @category drawing
 */
export type Themed = (theme: Theme) => string

/**
 * @category drawing
 */
export type ThemedPart = (theme: Theme) => Part

/**
 * Default {@link Theme} will draw trees with thin lines and minimal spacing and
 * indent.
 *
 * ```txt
 * ┬1  // default
 * ├─2 // theme
 * └─3 // example
 * ```
 * @category drawing
 */
export const defaultTheme: Theme = {
  spacing: 0,
  indents: 0,
  glyphs: glyphSet('thin'),
  formatter: identity,
}

/**
 * Theme constructor.
 * @category drawing
 */
export const Theme = ({
  spacing = 0,
  indents = 0,
  glyphs = glyphSet('thin'),
  formatter = identity,
}: Partial<Theme>): Theme => ({spacing, indents, glyphs, formatter})

/**
 * Build theme from {@link GlyphSet}.
 * @category drawing
 */
Theme.fromGlyphSet = (
  glyphs = glyphSet('thin'),
  indents = 0,
  theme?: Omit<Theme, 'glyphs' | 'indents'>,
): Theme => ({
  ...defaultTheme,
  indents,
  glyphs,
  ...theme,
})

/**
 * Build theme from {@link GlyphSetName}.
 * @category drawing
 */
Theme.fromNamedGlyphSet = (
  name: GlyphSetName = 'thin',
  indents = 0,
  theme?: Omit<Theme, 'glyphs' | 'indents'>,
): Theme => Theme.fromGlyphSet(glyphSet(name), indents, theme)
