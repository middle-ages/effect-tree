import {pipe, Function, Record, String, flow} from '#util'
import {
  elbowSet,
  lineSet,
  type ElbowSetName,
  type LineSetName,
  teeSet,
  type TeeSetName,
} from '../../glyph.js'

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
  'dashed',
  'dashedWide',
  'dotted',
  'double',
  'hDouble',
  'hThick',
  'round',
  'space',
  'thick',
  'thickDashed',
  'thickDashedWide',
  'thickDotted',
  'hThickDashed',
  'hThickDashedWide',
  'hThickDotted',
  'thin',
  'unix',
  'unixRound',
  'vDouble',
  'vThick',
  'vThickDashed',
  'vThickDashedWide',
  'vThickDotted',
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
  dashed: pipe('thin', fromSet, withLines('dashed')),
  dashedWide: pipe('thin', fromSet, withLines('dashedWide')),
  dotted: pipe('thin', fromSet, withLines('dotted')),
  double: fromSet('double'),
  hDouble: fromSet('hDouble'),
  hThick: fromSet('hThick'),
  hThickDashed: pipe(
    'hThick',
    fromSet,
    withHLine('thickDashed'),
    withVLine('dashed'),
  ),
  hThickDashedWide: pipe(
    'hThick',
    fromSet,
    withHLine('thickDashedWide'),
    withVLine('dashedWide'),
  ),
  hThickDotted: pipe(
    'hThick',
    fromSet,
    withHLine('thickDotted'),
    withVLine('dotted'),
  ),
  round: {...fromSet('thin'), elbow: elbowSet('round').bottomLeft},
  space: defaultSet,
  thick: fromSet('thick'),
  thickDashed: pipe('thick', fromSet, withLines('thickDashed')),
  thickDashedWide: pipe('thick', fromSet, withLines('thickDashedWide')),
  thickDotted: pipe('thick', fromSet, withLines('thickDotted')),
  thin: fromSet('thin'),
  unix,
  unixRound: {...unix, elbow: ' ' + elbowSet('round').bottomLeft},
  vThick: fromSet('vThick'),
  vThickDashed: pipe(
    'vThick',
    fromSet,
    withHLine('dashed'),
    withVLine('thickDashed'),
  ),
  vThickDashedWide: pipe(
    'vThick',
    fromSet,
    withHLine('dashedWide'),
    withVLine('thickDashedWide'),
  ),
  vThickDotted: pipe(
    'vThick',
    fromSet,
    withHLine('dotted'),
    withVLine('thickDotted'),
  ),
  vDouble: fromSet('vDouble'),
}

/**
 * Get a glyph set by name.
 * @example
 * import {Draw} from 'effect-tree'
 *
 * const glyph = Draw.glyphSet('thick').elbow
 *
 * expect(glyph).toBe('┗')
 * @param name Name of glyph set to get.
 * @returns Requested glyph set.
 * @category drawing
 * @function
 */
export const glyphSet = (name: GlyphSetName): GlyphSet => glyphSets[name]

function withLines(lines: LineSetName): Function.EndoOf<GlyphSet> {
  return flow(withHLine(lines), withVLine(lines))
}

function withVLine(lines: LineSetName): Function.EndoOf<GlyphSet> {
  return glyphSet => ({
    ...glyphSet,
    vLine: lineSet(lines).left,
  })
}

function withHLine(lines: LineSetName): Function.EndoOf<GlyphSet> {
  return glyphSet => ({
    ...glyphSet,
    hLine: lineSet(lines).top,
  })
}

function fromSet(set: LineSetName & TeeSetName & ElbowSetName): GlyphSet {
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
