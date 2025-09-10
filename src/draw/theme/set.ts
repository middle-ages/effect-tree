import {type EndoOf} from '#util/Function'
import {pipe, Record, Struct} from 'effect'
import {
  type GlyphRole,
  type GlyphRoleMap,
  type Theme,
  themed,
} from './themes.js'

export const setGlyphRole =
  (roleMap: GlyphRoleMap) =>
  (role: GlyphRole, glyph: string): GlyphRoleMap =>
    pipe(roleMap, Struct.evolve(Record.singleton(role, () => glyph)))

export const setIndents =
  (indents: number): EndoOf<Theme> =>
  theme =>
    pipe(theme, Struct.evolve({indents: () => indents}))

export const setSpacing =
  (spacing: number): EndoOf<Theme> =>
  theme =>
    pipe(theme, Struct.evolve({spacing: () => spacing}))

export const setGlyphs = themed(
  theme =>
    (glyphs: Partial<GlyphRoleMap>): Theme => ({
      ...theme,
      glyphs: {...theme.glyphs, ...glyphs},
    }),
)

export const setGlyph = themed(
  ({glyphs, ...rest}) =>
    (role: GlyphRole) =>
    (glyph: string): Theme => ({
      ...rest,
      glyphs: setGlyphRole(glyphs)(role, glyph),
    }),
)

/** Modify a named glyph of a theme. */
export const modGlyph = themed(
  theme =>
    (f: EndoOf<string>) =>
    (role: GlyphRole): Theme =>
      pipe(theme.glyphs[role], f, pipe(role, setGlyph(theme))),
)
