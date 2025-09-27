import {cross, type CrossName} from './crosses.js'
import {Function} from '#util'
import {elbowSet, type ElbowSetName} from './elbows.js'
import {lineSet, type LineSetName} from './lines.js'
import {teeSet, type TeeSetName} from './tees.js'
import type {ElbowSet, LineSet, TeeSet} from './types.js'

/**
 * A glyph group has a {@link TeeSet}, a {@link LineSet}, an {@link ElbowSet},
 * and a cross in some specific style.
 * @category drawing
 */
export interface GlyphGroup {
  tees: TeeSet
  lines: LineSet
  elbows: ElbowSet
  cross: string
}

/**
 * Build a glyph group by common style name.
 * @category drawing
 */
export const GlyphGroup = (
  name: TeeSetName & LineSetName & ElbowSetName & CrossName,
): GlyphGroup => ({
  tees: teeSet(name),
  lines: lineSet(name),
  elbows: elbowSet(name),
  cross: cross(name),
})

/**
 * Set the glyph group `tees` to the given {@link TeeSet}.
 * @category drawing
 */
export const setGroupTees =
  (tees: TeeSetName): Function.EndoOf<GlyphGroup> =>
  ({tees: _, ...group}) => ({
    ...group,
    tees: teeSet(tees),
  })

/**
 * Set the glyph group `lines` to the given {@link LineSet}.
 * @category drawing
 */
export const setGroupLines =
  (lines: LineSetName): Function.EndoOf<GlyphGroup> =>
  ({lines: _, ...group}) => ({
    ...group,
    lines: lineSet(lines),
  })

/**
 * Set the glyph group `elbows` to the given {@link ElbowSet}.
 * @category drawing
 */
export const setGroupElbows =
  (elbows: ElbowSetName): Function.EndoOf<GlyphGroup> =>
  ({elbows: _, ...group}) => ({
    ...group,
    elbows: elbowSet(elbows),
  })

/**
 * Set the `cross` glyph to the given string.
 * @category drawing
 */
export const setGroupCross =
  (cross: string): Function.EndoOf<GlyphGroup> =>
  ({cross: _, ...group}) => ({...group, cross})
