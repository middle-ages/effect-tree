import {map, type Tree} from '#tree'
import {Array, String, flow, pipe} from '#util'
import {type EndoOf} from '#Function'
import {text} from '../../part.js'
import {getGlyph} from './data.js'
import {type GlyphRole} from './glyph.js'
import {type Theme, type ThemedPart} from './types.js'

/**
 * Format tree nodes using the tree theme formatter.
 * @category drawing
 * @function
 */
export const formatNodes = ({formatter}: Theme): EndoOf<Tree<string>> =>
  map(formatter)

/**
 * Given a {@link Theme} and a {@link GlyphRole}, returns a function that will
 * prefix a string with the correct glyph.
 * @param theme - The {@link Theme} to use.
 * @returns The prefixed string.
 * @category drawing
 * @function
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
 * @function
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
 * and fills the size of the {@link Theme} `indents` field with the
 * given glyph role.
 * @category drawing
 * @function
 */
export const indentGlyph =
  (theme: Theme) =>
  (prefixRole: GlyphRole, indentRole: GlyphRole): string => {
    const glyph = getGlyph(theme)
    return pipe(
      indentRole,
      glyph,
      String.repeat(theme.indents),
      String.prefix(glyph(prefixRole)),
    )
  }

/**
 * A version of {@link indentGlyph} that returns its result in a {@link Text}
 * part instead of a string.
 * @category drawing
 * @function
 */
export const indentGlyphPart =
  (prefixRole: GlyphRole, indentRole: GlyphRole): ThemedPart =>
  theme =>
    flow(indentGlyph(theme), text)(prefixRole, indentRole)

/**
 * @category drawing
 * @function
 */
export function addSpacingAfter(label: string) {
  return (theme: Theme): Array.NonEmptyArray<string> =>
    (label + pipe('\n', String.repeat(theme.spacing))).split(
      /\n/,
    ) as Array.NonEmptyArray<string>
}
