import {expect, test} from 'vitest'
import {glyphSet} from './glyph.js'
import {suffixGlyph, prefixGlyph, Theme} from './theme.js'

const theme = Theme({glyphs: glyphSet('thin')})

test('prefixGlyph', () => {
  expect(prefixGlyph(theme)('tee')('foo')).toBe('┬foo')
})

test('suffixGlyph', () => {
  expect(suffixGlyph(theme)('rightTee')('foo')).toBe('foo├')
})
