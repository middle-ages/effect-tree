import {monoRecord} from '#util/Record'
import {segmentString} from '#util/String'
import {type TupleOf} from 'effect/Types'
import {directions} from '../direction.js'
import type {TeeSet} from './types.js'

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
 * The type of a elbow set name.
 * @category drawing
 */
export type TeeSetName = (typeof teeSetNames)[number]

/**
 * A record of all tee sets. A tee set has an elbow defined for each tee
 * direction. The elbows are grouped into sets by style.
 * @category drawing
 */
export type TeeSets = Record<TeeSetName, TeeSet>

const teeSets: TeeSets = {
  ascii: monoRecord('+')(...directions),
  double: fromQuad('╩╠╦╣'),
  hDouble: fromQuad('╧╞╤╡'),
  hThick: fromQuad('┷┝┯┥'),
  solid: monoRecord('█')(...directions),
  space: monoRecord(' ')(...directions),
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
