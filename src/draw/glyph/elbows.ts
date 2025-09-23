import {Record} from '#util'
import {dual, K, type EndoOf} from '#util/Function'
import {segmentString} from '#util/String'
import {type TupleOf} from 'effect/Types'
import {elbowDirections} from '../direction.js'
import type {CornerDirection, ElbowSet} from './types.js'

const _replaceElbow = (
  set: ElbowSet,
  direction: CornerDirection,
  glyph: string,
): ElbowSet => Record.modify(set, direction, K(glyph))

/**
 * Given a direction and a glyph, replaces the elbow at this direction in a given
 * elbow set with the given glyph and returns the new elbow set.
 *
 * At the key `named` you will find a version that does the same but accepts a
 * _name_ of an elbow set instead of an elbow set.
 * @param set - Elbow set to change.
 * @param direction - A {@link CornerDireection} of the glyph to be changed.
 * @param glyph - String of new glyph.
 * @returns Updated elbow set.
 * @category drawing
 */
export const replaceElbow: {
  (set: ElbowSet, direction: CornerDirection, glyph: string): ElbowSet
  (direction: CornerDirection, glyph: string): EndoOf<ElbowSet>
  named: (
    direction: CornerDirection,
    glyph: string,
  ) => (name: ElbowSetName) => ElbowSet
} = Object.assign(dual(3, _replaceElbow), {
  named: (direction: CornerDirection, glyph: string) => (name: ElbowSetName) =>
    _replaceElbow(elbowSet(name), direction, glyph),
})

/**
 * Names of all elbow sets.
 * @category drawing
 */
export const elbowSetNames = [
  'ascii',
  'diagonal',
  'double',
  'halfSolid',
  'halfSolidNear',
  'halfSolidFar',
  'hDouble',
  'hThick',
  'round',
  'solid',
  'space',
  'thick',
  'thin',
  'vDouble',
  'vThick',
] as const

/**
 * The type of a elbow set name.
 * @category drawing
 */
export type ElbowSetName = (typeof elbowSetNames)[number]

/**
 * A record of all elbow sets. An elbow set has an elbow defined for each elbow
 * direction. The elbows are grouped into sets by style.
 * @category drawing
 */
export type ElbowSets = Record<ElbowSetName, ElbowSet>

const elbowSets: ElbowSets = {
  ascii: fromQuad(`..''`),
  diagonal: {topLeft: '╱', topRight: '╲', bottomLeft: '╲', bottomRight: '╱'},
  double: fromQuad('╔╗╚╝'),
  hDouble: fromQuad('╒╕╘╛'),
  hThick: fromQuad('┍┑┕┙'),
  round: fromQuad('╭╮╰╯'),
  solid: Record.monoRecord('█')(...elbowDirections),
  space: Record.monoRecord(' ')(...elbowDirections),
  thick: fromQuad('┏┓┗┛'),
  thin: fromQuad('┌┐└┘'),
  vDouble: fromQuad('╓╖╙╜'),
  vThick: fromQuad('┎┒┖┚'),
  halfSolid: fromQuad('▞▚▚▞'),
  halfSolidNear: fromQuad('▗▖▝▘'),
  halfSolidFar: fromQuad('▛▜▙▟'),
}

/**
 * Get an elbow set by name.
 *
 * You can mix and match sets. For example if you need a set of elbows for a box
 * where all borders are thin lines except the bottom which is a thick line,
 * you could:
 *
 * ```ts
 * import {Draw} from 'effect-tree'
 *
 * const myElbowSet: Draw.ElbowSet = {
 *   ...Struct.pick(Draw.elbowSet('thin'), ...Draw.topElbows),
 *   ...Struct.pick(Draw.elbowSet('hThick'), ...Draw.bottomElbows),
 * }
 * ```
 *
 * And your elbows will be thin, except for the bottom:
 *
 * ```txt
 *    topLeft ┌ ┐ topRight
 *
 * bottomLeft ┕ ┙ bottomRight
 * ```
 * @category drawing
 */
export const elbowSet = (name: ElbowSetName): ElbowSet => elbowSets[name]

function fromQuad(s: string): ElbowSet {
  const [topLeft, topRight, bottomLeft, bottomRight] = segmentString(
    s,
  ) as TupleOf<4, string>
  return {topLeft, topRight, bottomRight, bottomLeft}
}
