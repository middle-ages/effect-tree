import {mapHeadTail} from '#util/Array'
import {prefix} from '#util/String'
import {flow, pipe, String} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import * as PR from './part.js'
import type {Part} from './part/types.js'
import type {Text} from './part/partF.js'
import {
  getGlyph,
  indentGlyph,
  themed,
  themedSpace,
  themedTextGlyph,
} from './theme.js'
import type {GlyphRole, Themed} from './theme.js'
import type {EndoOf} from '#util/Function'

// These are all parts required to draw a tree. Each is defined together with
// the glyph roles it uses and can be configured.
//
// For example the childTree part requires glyphs for the `rightTee` and
// `indent` roles.
//
const childTee = makeChildPart('rightTee', 'indent'),
  childElbow = makeChildPart('elbow', 'indent'),
  leafLabel = makeLabelPart('hLine', 'leafBullet', 'space'),
  branchLabel = makeLabelPart('tee', 'branchBullet', 'vLine'),
  headBranch = makeBranchPart(childTee, 'vLine'),
  tailBranch = makeBranchPart(childElbow, 'space')

export const atoms = {
  leafLabel,
  branchLabel,
  headBranch,
  tailBranch,
}

function makeChildPart(headPart: GlyphRole, tailPart: GlyphRole): Themed<Text> {
  return flow(indentGlyph(headPart, tailPart), PR.text)
}

function makeLabelPart(
  prefixRole: GlyphRole,
  bulletRole: GlyphRole,
  spaceRole: GlyphRole,
) {
  return (label: string): Themed<Part> =>
    themed(theme => {
      const glyph = getGlyph(theme),
        [before, bullet, space] = [
          glyph(prefixRole),
          glyph(bulletRole),
          glyph(spaceRole),
        ],
        prefixBullet = before + bullet,
        prefixBulletLength = prefixBullet.length,
        prefixPad = pipe(space, String.repeat(prefixBulletLength)) + bullet

      return pipe(
        theme,
        applySpacing(label),
        mapHeadTail(
          flow(prefix(prefixBullet), PR.text),
          flow(prefix(prefixPad), PR.text),
        ),
        PR.leftColumn,
      )
    })
}

function makeBranchPart(
  branch: Themed<Part>,
  glyphRole: GlyphRole,
): Themed<EndoOf<Part>> {
  return themed(
    theme => part =>
      pipe(
        part,
        PR.beforeTopLeft(branch(theme), [
          themedSpace(theme),
          [pipe(theme, themedTextGlyph(glyphRole))],
        ]),
      ),
  )
}

function applySpacing(label: string) {
  return themed(
    theme =>
      (label + pipe('\n', String.repeat(theme.spacing))).split(
        /\n/,
      ) as NonEmptyArray<string>,
  )
}
