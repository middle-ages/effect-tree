import {test, expect} from 'vitest'
import {flow, pipe, String} from '#util'
import {getTheme, Theme} from './themes.js'
import {
  getGlyph,
  getGlyphPart,
  setFormatter,
  getIndents,
  getSpacing,
  setIndents,
  setSpacing,
  getFormatter,
  incrementSpacing,
  decrementIndents,
  incrementIndents,
  decrementSpacing,
  fillSpacing,
  modFormatter,
} from './data.js'
import {from, of} from '#tree'
import {glyphSet} from './glyph.js'
import {elbowSet} from '../../glyph.js'
import {drawPart} from '../../part.js'
import {themedTree} from '../draw.js'

const theme: Theme = pipe(
  'thin',
  glyphSet,
  Theme.fromGlyphSet,
  setIndents(42),
  setSpacing(123),
)

test('getGlyph', () => {
  expect(getGlyph('elbow', theme)).toBe(elbowSet('thin').bottomLeft)
})

test('getGlyphPart', () => {
  expect(drawPart(getGlyphPart('elbow', theme))).toEqual([
    elbowSet('thin').bottomLeft,
  ])
})

test('getSpacing', () => {
  expect(getSpacing(theme)).toEqual(123)
})

test('setFormatter', () => {
  expect(
    pipe(
      theme,
      setFormatter(s => s + '!'),
      getFormatter,
    )('foo'),
  ).toEqual('foo!')
})

test('incrementIndents', () => {
  expect(pipe(theme, incrementIndents(), getIndents)).toEqual(43)
})

test('decrementIndents', () => {
  expect(pipe(theme, decrementIndents(), getIndents)).toEqual(41)
})

test('decrementIndents at zero', () => {
  expect(pipe(theme, setIndents(0), decrementIndents(), getIndents)).toEqual(0)
})

test('incrementSpacing', () => {
  expect(pipe(theme, incrementSpacing(), getSpacing)).toEqual(124)
})

test('decrementSpacing', () => {
  expect(pipe(theme, decrementSpacing(), getSpacing)).toEqual(122)
})

test('decrementSpacing at zero', () => {
  expect(pipe(theme, setSpacing(0), decrementSpacing(), getSpacing)).toEqual(0)
})

test('fromNamedGlyphSet', () => {
  expect(Theme.fromNamedGlyphSet('double').glyphs.elbow).toBe('╚')
})

test('fillSpacing', () => {
  expect(pipe(theme, setSpacing(2), fillSpacing)).toEqual(['\n'])
})

test('modFormatter', () => {
  const iut: Theme = pipe(
    getTheme('thin'),
    modFormatter(f => flow(f, String.prefix('«'))),
    modFormatter(f => flow(f, String.suffix('»'))),
  )

  expect(themedTree(from('a', of('b'), of('c')), iut)).toEqual([
    '┬«a» ',
    '├─«b»',
    '└─«c»',
  ])
})
