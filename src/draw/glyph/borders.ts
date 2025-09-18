import {elbowSet, type ElbowSetName} from './elbows.js'
import type {BorderSet} from './types.js'
import {lineSet, type LineSetName} from './lines.js'

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
 */
export const borderSet = (name: BorderSetName): BorderSet => borderSets[name]

function fromSets(lines: LineSetName, elbows: ElbowSetName): BorderSet {
  return {
    lines: lineSet(lines),
    elbows: elbowSet(elbows),
  }
}
