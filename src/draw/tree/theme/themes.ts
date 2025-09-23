import {Array, pipe, Record} from '#util'
import {square} from '#util/Pair'
import {type ThemeMap, type ThemeName, Theme, themeNames} from './types.js'

const indent = pipe(
  ['ascii', 'bullets', 'space'] as const,
  Array.map(square.mapSecond(name => Theme.fromNamedGlyphSet(name, 1))),
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
  Array.map(square.mapSecond(name => Theme.fromNamedGlyphSet(name, 0))),
)

const entries: (readonly [ThemeName, Theme])[] = [...indent, ...noIndent]
const themes = Record.fromEntries(entries) as ThemeMap

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
    Array.map(square.mapSecond(name => f(themes[name], name))),
    Record.fromEntries,
  )
