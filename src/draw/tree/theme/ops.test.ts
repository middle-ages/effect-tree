import {pipe} from '#util'
import {expect, test} from 'vitest'
import {setIndents, setSpacing} from './data.js'
import {glyphSet} from './glyph.js'
import {
  addSpacingAfter,
  indentGlyph,
  indentGlyphPart,
  prefixGlyph,
  suffixGlyph,
} from './ops.js'
import {Theme} from './types.js'
import {drawPart} from '../../part.js'

const theme: Theme = pipe(
  'thin',
  glyphSet,
  Theme.fromGlyphSet,
  setIndents(4),
  setSpacing(3),
)

test('prefixGlyph', () => {
  expect(prefixGlyph(theme)('elbow')('foo')).toBe('└foo')
})

test('suffixGlyph', () => {
  expect(suffixGlyph(theme)('elbow')('foo')).toBe('foo└')
})

test('indentGlyph', () => {
  expect(indentGlyph(theme)('elbow', 'hLine')).toBe('└────')
})

test('indentGlyphPart', () => {
  expect(drawPart(indentGlyphPart('elbow', 'hLine')(theme))).toEqual(['└────'])
})

test('applySpacingAfter', () => {
  expect(pipe(addSpacingAfter('foo')(theme))).toEqual(['foo', '', '', ''])
})
