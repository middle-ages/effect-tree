import {test, expect} from 'vitest'
import {pipe} from '#util'
import {Theme} from './types.js'
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
} from './data.js'
import {glyphSet} from './glyph.js'
import {elbowSet} from '../../glyph.js'
import {drawPart} from '../../part.js'

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

test('incrementSpacing', () => {
  expect(pipe(theme, incrementSpacing(), getSpacing)).toEqual(124)
})

test('decrementSpacing', () => {
  expect(pipe(theme, decrementSpacing(), getSpacing)).toEqual(122)
})
