import {Record} from '#util'
import {K, type EndoOf, dual} from '#util/Function'
import {segmentString} from '#util/String'
import {type TupleOf} from 'effect/Types'
import {type Direction, directions} from '../direction.js'
import type {TeeSet} from './types.js'

const _replaceTee = (
  set: TeeSet,
  direction: Direction,
  glyph: string,
): TeeSet => Record.modify(set, direction, K(glyph))

/**
 * Given a direction and a glyph, replaces the tee at this direction in a given
 * tee set with the given glyph and returns the new tee set.
 *
 * At the key `named` you will find a version that does the same but accepts a
 * _name_ of a tee set instead of an tee set.
 * @param set - Tee set to change.
 * @param direction - A {@link Direction} of the glyph to be changed.
 * @param glyph - String of new glyph.
 * @returns Updated tee set.
 * @category drawing
 */
export const replaceTee: {
  (set: TeeSet, direction: Direction, glyph: string): TeeSet
  (direction: Direction, glyph: string): EndoOf<TeeSet>
  named: (direction: Direction, glyph: string) => (name: TeeSetName) => TeeSet
} = Object.assign(dual(3, _replaceTee), {
  named:
    (direction: Direction, glyph: string) =>
    (name: TeeSetName): TeeSet =>
      _replaceTee(teeSet(name), direction, glyph),
})

/**
 * Names of all tee sets.
 * @category drawing
 */
export const teeSetNames = [
  'ascii',
  'double',
  'hDouble',
  'hThick',
  'solid',
  'space',
  'thick',
  'thin',
  'vDouble',
  'vThick',
  'vThickTop',
  'vThickBottom',
] as const

/**
 * The type of a tee set name.
 * @category drawing
 */
export type TeeSetName = (typeof teeSetNames)[number]

/**
 * A record of all tee sets. A tee set has a tee glyph defined for each tee
 * direction. The tees are grouped into sets by style.
 * @category drawing
 */
export type TeeSets = Record<TeeSetName, TeeSet>

const teeSets: TeeSets = {
  ascii: Record.monoRecord('+')(...directions),
  double: fromQuad('╩╠╦╣'),
  hDouble: fromQuad('╧╞╤╡'),
  hThick: fromQuad('┷┝┯┥'),
  solid: Record.monoRecord('█')(...directions),
  space: Record.monoRecord(' ')(...directions),
  thick: fromQuad('┻┣┳┫'),
  thin: fromQuad('┴├┬┤'),
  vDouble: fromQuad('╨╟╥╢'),
  vThick: fromQuad('┸┠┰┨'),
  vThickTop: fromQuad('┴┞┰┦'),
  vThickBottom: fromQuad('┸┟┬┧'),
}

/**
 * Get a tee set by name.
 * @category drawing
 */
export const teeSet = (name: TeeSetName): TeeSet => teeSets[name]

function fromQuad(s: string): TeeSet {
  const [top, right, bottom, left] = segmentString(s) as TupleOf<4, string>
  return {top, right, bottom, left}
}
