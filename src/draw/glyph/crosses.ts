/**
 * Names of all cross glyphs.
 * @category drawing
 */
export const crossNames = [
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
  'vThickBottom',
  'vThickLeft',
  'vThickRight',
  'vThickTop',
  'vThinBottom',
  'vThinLeft',
  'vThinRight',
  'vThinTop',
] as const

/**
 * The type of a cross name.
 * @category drawing
 */
export type CrossName = (typeof crossNames)[number]

/**
 * A record of all cross glyphs by name.
 * @category drawing
 */
export type Crosses = Record<CrossName, string>

const crosses: Crosses = {
  ascii: '+',
  double: '╬',
  hDouble: '╪',
  hThick: '┿',
  solid: '█',
  space: ' ',
  thick: '╋',
  thin: '┼',
  vDouble: '╫',
  vThick: '╂',
  vThickBottom: '╁',
  vThickLeft: '┽',
  vThickRight: '┾',
  vThickTop: '╀',
  vThinBottom: '╇',
  vThinLeft: '╊',
  vThinRight: '╉',
  vThinTop: '╈',
}

/**
 * Get a tee set by name.
 * @function
 * @category drawing
 */
export const cross = (name: CrossName): string => crosses[name]
