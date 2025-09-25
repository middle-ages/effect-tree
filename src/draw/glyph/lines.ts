import {Record} from '#util'
import {K, dual, type EndoOf} from '#Function'
import {segmentString} from '#String'
import type {TupleOf} from 'effect/Types'
import {directions, type Direction} from '../direction.js'
import type {LineSet} from './types.js'

const _replaceLine = (
  set: LineSet,
  direction: Direction,
  glyph: string,
): LineSet => Record.modify(set, direction, K(glyph))

/**
 * Given a direction and a glyph, replaces the line at this direction in a given
 * line set set with the given glyph and returns the new line set.
 *
 * At the key `named` you will find a version that does the same but accepts a
 * _name_ of a line set instead of a line set.
 * @param set - Line set to change.
 * @param direction - A {@link Direction} of the glyph to be changed.
 * @param glyph - String of new glyph.
 * @returns Updated line set.
 * @category drawing
 * @function
 */
export const replaceLine: {
  (set: LineSet, direction: Direction, glyph: string): LineSet
  (direction: Direction, glyph: string): EndoOf<LineSet>
  named: (direction: Direction, glyph: string) => (name: LineSetName) => LineSet
} = Object.assign(dual(3, _replaceLine), {
  named:
    (direction: Direction, glyph: string) =>
    (name: LineSetName): LineSet =>
      _replaceLine(lineSet(name), direction, glyph),
})

/**
 * Names of all line sets.
 * @category drawing
 */
export const lineSetNames = [
  'ascii',
  'dashed',
  'dashedWide',
  'dotted',
  'double',
  'halfSolid',
  'halfSolidNear',
  'halfSolidFar',
  'hDouble',
  'hThick',
  'near',
  'solid',
  'space',
  'thick',
  'thickDashed',
  'thickDashedWide',
  'thickDotted',
  'thin',
  'vDouble',
  'vThick',
] as const

/**
 * The type of a line set name.
 * @category drawing
 */
export type LineSetName = (typeof lineSetNames)[number]

/**
 * A record of all line sets.
 * @category drawing
 */
export type LineSets = Record<LineSetName, LineSet>

const lineSets: LineSets = {
  ascii: fromPair('-|'),
  dashed: fromPair('┄┆'),
  dashedWide: fromPair('╌╎'),
  dotted: fromPair('┈┊'),
  double: fromPair('═║'),
  halfSolid: fromQuad('▀▐▄▌'),
  halfSolidNear: fromQuad('▄▌▀▐'),
  halfSolidFar: fromQuad('▀▐▄▌'),
  hDouble: fromPair('═│'),
  hThick: fromPair('━│'),
  near: fromQuad('▁▏▔▕'),
  solid: Record.monoRecord('█')(...directions),
  space: Record.monoRecord(' ')(...directions),
  thick: fromPair('━┃'),
  thickDashed: fromPair('┅┇'),
  thickDashedWide: fromPair('╍╏'),
  thickDotted: fromPair('┉┋'),
  thin: fromPair('─│'),
  vDouble: fromPair('─║'),
  vThick: fromPair('─┃'),
}

/**
 * Get a line set by name.
 * @category drawing
 * @function
 */
export const lineSet = (name: LineSetName): LineSet => lineSets[name]

function fromPair(s: string): LineSet {
  const [top, right] = segmentString(s) as TupleOf<2, string>
  return {top, right, bottom: top, left: right}
}

function fromQuad(s: string): LineSet {
  const [top, right, bottom, left] = segmentString(s) as TupleOf<4, string>
  return {top, right, bottom, left}
}
