import {String, pipe} from '#util'
import {type EndoOf} from '#util/Function'
import {type Part, text} from '../part.js'
import {glyphSet, type GlyphRole, type GlyphSet} from './glyph.js'

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
}

/**
 * @category drawing
 */
export type ThemedPart = (theme: Theme) => Part

/**
 * Get a glyph by role from a theme
 * @category drawing
 */
export const getGlyph =
  ({glyphs}: Theme) =>
  (name: GlyphRole): string =>
    glyphs[name]

/**
 * @category drawing
 */
export const getGlyphPart =
  (name: GlyphRole): ThemedPart =>
  theme =>
    pipe(name, getGlyph(theme), text)

/**
 * Theme constructor.
 * @category drawing
 */
export const Theme = ({
  spacing = 0,
  indents = 0,
  glyphs = glyphSet('thin'),
}: Partial<Theme>): Theme => ({spacing, indents, glyphs})

/**
 * Given a {@link Theme} and a {@link GlyphRole}, returns a function that will
 * prefix a string with the correct glyph.
 * @param theme - The {@link Theme} to use.
 * @returns The prefixed string.
 * @category drawing
 */
export const prefixGlyph =
  (theme: Theme) =>
  /** The {@link GlyphRole} required. */
  (role: GlyphRole): EndoOf<string> =>
  /** The string to prefix with the glyph. */
  suffix =>
    pipe(role, getGlyph(theme), String.suffix(suffix))

/**
 * Given a {@link Theme} and a {@link GlyphRole}, returns a function that will
 * suffix a string with the correct glyph.
 * @param theme - The {@link Theme} to use.
 * @returns The suffixed string.
 * @category drawing
 */
export const suffixGlyph =
  (theme: Theme) =>
  /** The {@link GlyphRole} required. */
  (role: GlyphRole): EndoOf<string> =>
  /** The string to prefix with the glyph. */
  prefix =>
    pipe(role, getGlyph(theme), String.prefix(prefix))

/**
 * Given a {@link GlyphRole} as a _prefix_, and another one for _indents_,
 * returns a string that starts with the glyph from the prefix role,
 * and fills the size of the {@link Theme} `indents` field with a
 * glyph of the role given in `indentRole`.
 * @returns The joined string.
 * @category drawing
 */
export const indentGlyph =
  (theme: Theme) =>
  (prefixRole: GlyphRole, indentRole: GlyphRole): string => {
    const glyph = getGlyph(theme)
    return (
      glyph(prefixRole) + pipe(indentRole, glyph, String.repeat(theme.indents))
    )
  }
