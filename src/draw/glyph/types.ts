import type {elbowDirections, Directed} from '../direction.js'

/**
 * Union of the four directions where corner glyphs are placed: `topLeft`,
 * `topRight`, `bottomRight`, and `bottomLeft`.
 * @category drawing
 */
export type CornerDirection = (typeof elbowDirections)[number]

/**
 * A record of values of type `A`, one per corner direction.
 * @category drawing
 */
export type Cornered<A> = Record<CornerDirection, A>

/**
 * A record of elbow glyph per corner direction describing some corner style
 * for boxes and elbows.
 * @category drawing
 */
export type ElbowSet = Cornered<string>

/**
 * A record of line glyph per direction describing some style for lines.
 * @category drawing
 */
export type LineSet = Directed<string>

/**
 * A record of line glyph per direction describing some style for tees.
 * @category drawing
 */
export type TeeSet = Directed<string>

/**
 * A line set and corner set that can form a box border.
 * @category drawing
 */
export interface BorderSet {
  lines: LineSet
  elbows: ElbowSet
}
