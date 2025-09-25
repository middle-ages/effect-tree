import {dual, type EndoOf} from '#Function'
import type {Direction} from '../direction.js'
import {elbowSet, replaceElbow, type ElbowSetName} from './elbows.js'
import {lineSet, replaceLine, type LineSetName} from './lines.js'
import type {BorderSet, CornerDirection} from './types.js'

/**
 * Replace the border line at a direction in the given set.
 * @param set The border set to change.
 * @param direction Line direction to change.
 * @param glyph New glyph.
 * @returns Updated border set.
 * @category drawing
 * @function
 */
export const replaceBorderLine: {
  (set: BorderSet, direction: Direction, glyph: string): BorderSet
  (direction: Direction, glyph: string): EndoOf<BorderSet>
  named: (direction: Direction, from: LineSetName) => EndoOf<BorderSet>
} = Object.assign(
  dual(
    3,
    (
      {lines, ...set}: BorderSet,
      direction: Direction,
      glyph: string,
    ): BorderSet => ({...set, lines: replaceLine(lines, direction, glyph)}),
  ),
  {
    named:
      (direction: Direction, from: LineSetName): EndoOf<BorderSet> =>
      ({lines, ...set}) => ({
        ...set,
        lines: replaceLine(lines, direction, borderSet(from).lines[direction]),
      }),
  },
)

/**
 * Replace the border elbow at a direction in the given set.
 * @param set The border set to change.
 * @param direction Corner direction to change.
 * @param glyph New glyph.
 * @returns Updated border set.
 * @category drawing
 * @function
 */
export const replaceBorderElbow: {
  (set: BorderSet, direction: CornerDirection, glyph: string): BorderSet
  (direction: CornerDirection, glyph: string): EndoOf<BorderSet>
  named: (direction: CornerDirection, from: ElbowSetName) => EndoOf<BorderSet>
} = Object.assign(
  dual(
    3,
    (
      {elbows, ...set}: BorderSet,
      direction: CornerDirection,
      glyph: string,
    ): BorderSet => ({...set, elbows: replaceElbow(elbows, direction, glyph)}),
  ),
  {
    named:
      (direction: CornerDirection, from: ElbowSetName): EndoOf<BorderSet> =>
      ({elbows, ...set}) => ({
        ...set,
        elbows: replaceElbow(elbows, direction, elbowSet(from)[direction]),
      }),
  },
)
/**
 * Names of all border sets.
 * @category drawing
 */
export const borderSetNames = [
  'ascii',
  'beveled',
  'dashed',
  'dashedWide',
  'dotted',
  'double',
  'halfSolid',
  'halfSolidFar',
  'halfSolidNear',
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
 * The type of a border set name.
 * @category drawing
 */
export type BorderSetName = (typeof borderSetNames)[number]

/**
 * A record of all border sets.
 * @category drawing
 */
export type BorderSets = Record<BorderSetName, BorderSet>

const borderSets: BorderSets = {
  ascii: fromSets('ascii', 'ascii'),
  thin: fromSets('thin', 'thin'),
  dashed: fromSets('dashed', 'thin'),
  dashedWide: fromSets('dashedWide', 'thin'),
  dotted: fromSets('dotted', 'thin'),
  thick: fromSets('thick', 'thick'),
  hThick: fromSets('hThick', 'hThick'),
  vThick: fromSets('vThick', 'vThick'),
  thickDashed: fromSets('thickDashed', 'thick'),
  thickDashedWide: fromSets('dashedWide', 'thick'),
  thickDotted: fromSets('thickDotted', 'thick'),
  double: fromSets('double', 'double'),
  hDouble: fromSets('hDouble', 'hDouble'),
  vDouble: fromSets('vDouble', 'vDouble'),
  solid: fromSets('solid', 'solid'),
  space: fromSets('space', 'space'),
  near: fromSets('near', 'space'),
  halfSolid: fromSets('halfSolid', 'halfSolid'),
  halfSolidNear: fromSets('halfSolidNear', 'halfSolidNear'),
  halfSolidFar: fromSets('halfSolidFar', 'halfSolidFar'),
  beveled: fromSets('near', 'diagonal'),
}

/**
 * Get a line set by name.
 * @category drawing
 * @function
 */
export const borderSet = (name: BorderSetName): BorderSet => borderSets[name]

function fromSets(lines: LineSetName, elbows: ElbowSetName): BorderSet {
  return {
    lines: lineSet(lines),
    elbows: elbowSet(elbows),
  }
}
