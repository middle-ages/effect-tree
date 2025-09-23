import {cross, type CrossName} from './crosses.js'
import {elbowSet, type ElbowSetName} from './elbows.js'
import {lineSet, type LineSetName} from './lines.js'
import {teeSet, type TeeSetName} from './tees.js'
import type {ElbowSet, LineSet, TeeSet} from './types.js'

/**
 * Get all glyph groups by common style name.
 * @category drawing
 */
export const glyphGroups = (
  name: TeeSetName & LineSetName & ElbowSetName & CrossName,
): {
  tees: TeeSet
  lines: LineSet
  elbows: ElbowSet
  cross: string
} => ({
  tees: teeSet(name),
  lines: lineSet(name),
  elbows: elbowSet(name),
  cross: cross(name),
})
