import {monoRecord} from '#util/Record'
import {segmentString} from '#util/String'
import type {TupleOf} from 'effect/Types'
import type {LineSet} from './types.js'
import {directions} from '../direction.js'

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
  near: fromQuad('▁▕▔▏'),
  solid: monoRecord('█')(...directions),
  space: monoRecord(' ')(...directions),
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
