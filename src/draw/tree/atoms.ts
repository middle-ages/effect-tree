import {String} from '#util'
import {mapHeadTail} from '#util/Array'
import type {EndoOf} from '#util/Function'
import {flow, pipe} from 'effect'
import * as Part from '../part.js'
import {Struts, HStrut, VStrut} from '../struts.js'
import {
  addSpacingAfter,
  getGlyph,
  indentGlyphPart,
  type GlyphRole,
  type Theme,
  type ThemedPart,
} from './theme.js'

const childTee: ThemedPart = indentGlyphPart('rightTee', 'indent')
const childElbow: ThemedPart = indentGlyphPart('elbow', 'indent')

/**
 * @category drawing
 */
export const leafLabel: (label: string) => ThemedPart = label(
  'hLine',
  'leafBullet',
  'space',
)

/**
 * @category drawing
 */
export const branchLabel: (label: string) => ThemedPart = label(
  'tee',
  'branchBullet',
  'vLine',
)

function label(
  prefixRole: GlyphRole,
  bulletRole: GlyphRole,
  spaceRole: GlyphRole,
) {
  return (label: string): ThemedPart =>
    theme => {
      const glyph = getGlyph(theme),
        [before, bullet, space] = [
          glyph(prefixRole),
          glyph(bulletRole),
          glyph(spaceRole),
        ],
        prefixBullet = before + bullet,
        prefixPad =
          String.repeat(String.stringWidth(prefixBullet))(space) + bullet

      return pipe(
        theme,
        addSpacingAfter(label),
        mapHeadTail(
          flow(String.prefix(prefixBullet), Part.text),
          flow(String.prefix(prefixPad), Part.text),
        ),
        Part.column.left,
      )
    }
}

/**
 * @category drawing
 */
export const headBranch = parent(childTee, 'vLine')

/**
 * @category drawing
 */
export const tailBranch = parent(childElbow, 'space')

function parent(branch: ThemedPart, glyphRole: GlyphRole) {
  return (theme: Theme): EndoOf<Part.Part> => {
    const glyph = getGlyph(theme)
    return Part.after.top.left(
      branch(theme),
      Struts(VStrut.empty, HStrut([glyph('space')], glyph(glyphRole))),
    )
  }
}
