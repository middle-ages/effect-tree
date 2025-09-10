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

export const getTheme = (name: ThemeName): Theme => themes[name],
  getSpacing: Themed<number> = themed(pluck('spacing')),
  getIndents: Themed<number> = themed(pluck('indents')),
  getGlyphMap: Themed<GlyphRoleMap> = themed(pluck('glyphs')),
  getGlyph = themed(
    theme =>
      (role: GlyphRole): string =>
        getGlyphMap(theme)[role],
  )

export const prefixGlyph = themed(
  theme =>
    (role: GlyphRole): EndoOf<string> =>
    s =>
      pipe(role, getGlyph(theme), suffix(s)),
)

export const suffixGlyph = themed(
  theme =>
    (role: GlyphRole): EndoOf<string> =>
    s =>
      pipe(role, getGlyph(theme), prefix(s)),
)

export const indentGlyph =
  (prefixRole: GlyphRole, indentRole: GlyphRole): Themed<string> =>
  theme => {
    const glyph = getGlyph(theme)
    return (
      glyph(prefixRole) +
      pipe(indentRole, glyph, String.repeat(getIndents(theme)))
    )
  }
