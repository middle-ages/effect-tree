/**
 * Glyph role names.
 * @category drawing
 */
export const glyphRoles = [
  'tee',
  'rightTee',
  'elbow',
  'hLine',
  'vLine',
  'indent',
  'space',
  'rootBullet',
  'branchBullet',
  'leafBullet',
] as const

/**
 * Glyph set names. Each glyph set name has an associated
 * {@link GlyphRoleMap} that maps each {@link GlyphRole} to a glyph.
 * @category drawing
 */
export const glyphSetNames = [
  'space',
  'bullets',
  'thin',
  'thick',
  'rounded',
  'ascii',
  'unix',
  'unixRounded',
] as const

const thin = {
  tee: '┬',
  rightTee: '├',
  elbow: '└',
  hLine: '─',
  vLine: '│',
  indent: '─',
  space: ' ',
  rootBullet: '',
  branchBullet: '',
  leafBullet: '',
} satisfies Record<(typeof glyphRoles)[number], string>

const unix = {
  tee: '─',
  rightTee: ' ├',
  elbow: ' └',
  hLine: '─',
  vLine: ' │',
  indent: '──',
  space: '  ',
  rootBullet: '',
  branchBullet: '',
  leafBullet: '',
} satisfies Record<(typeof glyphRoles)[number], string>

/**
 * Maps every {@link GlyphSetName} to its {@link GlyphRoleMap}.
 * Given a {@link GlyphSetName}  and {@link GlyphRole}
 * the author of the {@link ThemedPart} can find here a glyph.
 * @category drawing
 */
export const glyphMap = {
  space: {
    tee: ' ',
    rightTee: ' ',
    elbow: ' ',
    hLine: ' ',
    vLine: ' ',
    indent: ' ',
    space: ' ',
    rootBullet: '',
    branchBullet: '',
    leafBullet: '',
  },

  bullets: {
    tee: ' ',
    rightTee: ' ',
    elbow: ' ',
    hLine: ' ',
    vLine: ' ',
    indent: ' ',
    space: ' ',
    rootBullet: '►',
    branchBullet: '∘',
    leafBullet: '∙',
  },

  thin,

  thick: {
    tee: '┳',
    rightTee: '┣',
    elbow: '┗',
    hLine: '━',
    vLine: '┃',
    indent: '━',
    space: ' ',
    rootBullet: '',
    branchBullet: '',
    leafBullet: '',
  },

  ascii: {
    tee: '+',
    rightTee: '+',
    elbow: "'",
    hLine: '-',
    vLine: '|',
    indent: '-',
    space: ' ',
    rootBullet: '',
    branchBullet: '',
    leafBullet: '',
  },

  unix,

  rounded: {...thin, elbow: '╰'},

  unixRounded: {...unix, elbow: ' ╰'},
} satisfies Record<
  (typeof glyphSetNames)[number],
  Record<(typeof glyphRoles)[number], string>
>
