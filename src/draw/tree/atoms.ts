import {mapHeadTail} from '#util/Array'
import type {EndoOf} from '#util/Function'
import {prefix} from '#util/String'
import {flow, pipe, String} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import * as Part from '../part.js'
import {HStrut} from '../struts.js'
import {type GlyphRole} from './glyph.js'
import {type Theme, type ThemedPart, getGlyph, indentGlyph} from './theme.js'

const childTee: ThemedPart = child('rightTee', 'indent')
const childElbow: ThemedPart = child('elbow', 'indent')

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

/**
 * @category drawing
 */
export const headBranch = parent(childTee, 'vLine')

/**
 * @category drawing
 */
export const tailBranch = parent(childElbow, 'space')

function child(headPart: GlyphRole, tailPart: GlyphRole): ThemedPart {
  return theme => Part.text(indentGlyph(theme)(headPart, tailPart))
}

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
        prefixPad = pipe(space, String.repeat(prefixBullet.length)) + bullet

      return pipe(
        theme,
        applySpacing(label),
        mapHeadTail(
          flow(prefix(prefixBullet), Part.text),
          flow(prefix(prefixPad), Part.text),
        ),
        Part.column.left,
      )
    }
}

function parent(branch: ThemedPart, glyphRole: GlyphRole) {
  return (theme: Theme): EndoOf<Part.Part> => {
    const glyph = getGlyph(theme)
    return Part.after.top.left(branch(theme), {
      hStrut: HStrut([glyph('space')], glyph(glyphRole)),
    })
  }
}

function applySpacing(label: string) {
  return (theme: Theme): NonEmptyArray<string> =>
    (label + pipe('\n', String.repeat(theme.spacing))).split(
      /\n/,
    ) as NonEmptyArray<string>
}
