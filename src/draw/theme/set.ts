import {type EndoOf} from '#util/Function'
import {pipe, Record, Struct} from 'effect'
import {
  type GlyphRole,
  type GlyphRoleMap,
  type Theme,
  themed,
} from './themes.js'

/**
 * Modify the glyph associated with a {@link GlyphRole} in a
 * {@link GlyphRoleMap}.
 * @param roleMap - The mapping role → glyph to modify.
 * @returns A role map where the new glyph is associated with the given role.
 * @category drawing
 */
export const setGlyphRole =
  (roleMap: GlyphRoleMap) =>
  (
    /** The role in the map to modify. */
    role: GlyphRole,
    /** The new glyph for the role. */
    glyph: string,
  ): GlyphRoleMap =>
    pipe(roleMap, Struct.evolve(Record.singleton(role, () => glyph)))

/**
 * Modify the `indents` settings of the given {@link Theme}.
 * @param indents - The new numeric value for `indents`.
 * @returns An updated theme.
 * @category drawing
 */
export const setIndents =
  (indents: number): EndoOf<Theme> =>
  /** The theme to modify. */
  theme =>
    pipe(theme, Struct.evolve({indents: () => indents}))

/**
 * Modify the `spacing` settings of the given {@link Theme}.
 * @param spacing - The new numeric value for `spacing`.
 * @returns An updated theme.
 * @category drawing
 */
export const setSpacing =
  (spacing: number): EndoOf<Theme> =>
  /** The theme to modify. */
  theme =>
    pipe(theme, Struct.evolve({spacing: () => spacing}))

/**
 * @category drawing
 */
export const setGlyphs = themed(
  theme =>
    (glyphs: Partial<GlyphRoleMap>): Theme => ({
      ...theme,
      glyphs: {...theme.glyphs, ...glyphs},
    }),
)

/**
 * Change the glyph associated with a
 * {@link GlyphRole} in the {@link Theme}.
 * @param theme - The theme to modify.
 * @returns The updated theme.
 * @category drawing
 */
export const setGlyph = themed(
  ({glyphs, ...rest}) =>
    /** The role in the map to modify. */
    (role: GlyphRole) =>
    /** The new glyph for the role. */
    (glyph: string): Theme => ({
      ...rest,
      glyphs: setGlyphRole(glyphs)(role, glyph),
    }),
)

/**
 * Run a function to modify the glyph associated with a
 * {@link GlyphRole} in the {@link Theme}.
 * @param theme - The theme to modify.
 * @returns The updated theme.
 * @category drawing
 */
export const modGlyph = themed(
  theme =>
    /** A function from `string` to `string` that will be used to change the glyph.  */
    (f: EndoOf<string>) =>
    /** The role of the glyph that will changed. */
    (role: GlyphRole): Theme =>
      pipe(theme.glyphs[role], f, pipe(role, setGlyph(theme))),
)
