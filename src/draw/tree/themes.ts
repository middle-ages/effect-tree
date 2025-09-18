import {Array, pipe, Record} from '#util'
import {type GlyphSetName, glyphSet, glyphSetNames} from './glyph.js'
import {Theme} from './theme.js'

/**
 * Type of theme names.
 * @category drawing
 */
export type ThemeName = GlyphSetName

/**
 * Tree theme names.
 * @category drawing
 */
export const themeNames = glyphSetNames

type Themes = Record<ThemeName, Theme>

const build = (name: ThemeName, indents = 0) =>
  Theme({glyphs: glyphSet(name), indents})

const indent = pipe(
  ['ascii', 'bullets', 'space'] as const,
  Array.map(name => [name, build(name, 1)] as const),
)

const noIndent = pipe(
  [
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
  ] as const,
  Array.map(name => [name, build(name, 0)] as const),
)
const themes = Record.fromEntries([...indent, ...noIndent]) as Themes

/**
 * Map of theme name to theme.
 * @category drawing
 */
export const getTheme = (name: ThemeName): Theme => themes[name]

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
