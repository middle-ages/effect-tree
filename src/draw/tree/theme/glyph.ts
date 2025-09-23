import {Record, String} from '#util'
import {
  elbowSet,
  lineSet,
  type ElbowSetName,
  type LineSetName,
} from '../../glyph.js'
import {teeSet, type TeeSetName} from '../../glyph/tees.js'

/**
 * A role for a glyph in a glyph role map.
 * @category drawing
 */
export type GlyphRole = (typeof glyphRoles)[number]

/**
 * Maps roles to glyphs.
 * @category drawing
 */
export type GlyphSet = Record<GlyphRole, string>

/**
 * A named {@link GlyphSet}.
 * @category drawing
 */
export type GlyphSetName = (typeof glyphSetNames)[number]

/**
 * Bullet role names.
 * @category drawing
 */
export const bulletRoles = ['rootBullet', 'branchBullet', 'leafBullet'] as const

/**
 * Glyph role names.
 * @category drawing
 */
export const glyphRoles = [
  'elbow',
  'hLine',
  'indent',
  'rightTee',
  'space',
  'tee',
  'vLine',
  ...bulletRoles,
] as const

/**
 * Glyph set names.
 * @category drawing
 */
export const glyphSetNames = [
  'ascii',
  'bullets',
  'double',
  'hDouble',
  'hThick',
  'round',
  'space',
  'thick',
  'thin',
  'unix',
  'unixRound',
  'vDouble',
  'vThick',
] as const

const noBullets = Record.monoRecord('')(...bulletRoles)

const defaultSet: GlyphSet = {
  ...Record.monoRecord('')(...glyphRoles),
  ...getLines('space'),
  ...noBullets,
  tee: teeSet('space').bottom,
  rightTee: teeSet('space').right,
  elbow: elbowSet('space').bottomLeft,
  space: ' ',
  indent: ' ',
}

const unix: GlyphSet = {
  ...defaultSet,
  hLine: lineSet('thin').top,
  vLine: ' ' + lineSet('thin').left,
  elbow: ' ' + elbowSet('thin').bottomLeft,
  tee: lineSet('thin').bottom,
  rightTee: ' ' + teeSet('thin').right,
  indent: String.repeat(2)(lineSet('thin').top),
  space: '  ',
}

const glyphSets: Record<GlyphSetName, GlyphSet> = {
  ascii: {...defaultSet, ...fromSet('ascii'), indent: lineSet('ascii').top},
  bullets: {
    ...defaultSet,
    rootBullet: '►',
    branchBullet: '∘',
    leafBullet: '∙',
  },
  double: fromSet('double'),
  hDouble: fromSet('hDouble'),
  hThick: fromSet('hThick'),
  round: {...fromSet('thin'), elbow: elbowSet('round').bottomLeft},
  space: defaultSet,
  thick: fromSet('thick'),
  thin: fromSet('thin'),
  unix,
  unixRound: {...unix, elbow: ' ' + elbowSet('round').bottomLeft},
  vThick: fromSet('vThick'),
  vDouble: fromSet('vDouble'),
}

export const glyphSet = (name: GlyphSetName): GlyphSet => glyphSets[name]

function fromSet(set: LineSetName & TeeSetName & ElbowSetName) {
  return {
    ...defaultSet,
    ...getLines(set),
    ...getTees(set),
    elbow: elbowSet(set).bottomLeft,
    indent: lineSet(set).top,
  }
}

function getLines(set: LineSetName) {
  return {
    hLine: lineSet(set).top,
    vLine: lineSet(set).left,
  }
}

function getTees(set: TeeSetName) {
  return {
    tee: teeSet(set).bottom,
    rightTee: teeSet(set).right,
  }
}
