import {describe, expect, test} from 'vitest'
import {
  draw as drawPart,
  getGlyph,
  getTheme,
  indentGlyph,
  leftColumn,
  modGlyph,
  prefixGlyph,
  foreachThemed,
  setGlyph,
  setGlyphs,
  setIndents,
  setSpacing,
  text,
  themed,
  type Part,
  type Themed,
  suffixGlyph,
} from '#draw'
import {Array, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {prefix} from '#util/String'

describe('theme', () => {
  describe('get', () => {
    test('getGlyph', () => {
      expect(getGlyph(getTheme('thick'))('rightTee')).toBe('┣')
    })

    test('prefixGlyph', () => {
      expect(prefixGlyph(getTheme('thin'))('tee')('foo')).toBe('┬foo')
    })

    describe('indentGlyph', () => {
      test('indents=0', () => {
        const theme = pipe('thick', getTheme, setIndents(0))
        expect(indentGlyph('rightTee', 'hLine')(theme)).toBe('┣')
      })
      test('indents=2', () => {
        const theme = pipe('thick', getTheme, setIndents(2))
        expect(indentGlyph('rightTee', 'hLine')(theme)).toBe('┣━━')
      })
    })
  })

  describe('set', () => {
    test('setGlyph', () => {
      const theme = getTheme('thick')
      const updatedTheme = setGlyph(theme)('elbow')('X')
      const actual = getGlyph(updatedTheme)('elbow')
      expect(actual).toBe('X')
    })

    test('setSpacing', () => {
      const theme = setSpacing(10)(getTheme('thick'))
      expect(theme.spacing).toBe(10)
    })

    test('setGlyphs', () => {
      const theme = setGlyphs(getTheme('thick'))({
        tee: 'T',
        elbow: 'E',
      })

      expect(getGlyph(theme)('tee')).toBe('T')
      expect(getGlyph(theme)('elbow')).toBe('E')
    })
  })

  test('sequenceThemed', () => {
    const theme = getTheme('thin')

    const parts: NonEmptyArray<Themed<Part>> = pipe(
      Array.range(1, 5),
      Array.map(i => themed(() => text(i.toString()))),
    )

    const actual: string[] = pipe(
      theme,
      foreachThemed(parts),
      leftColumn,
      drawPart,
    )

    expect(actual).toEqual(['1', '2', '3', '4', '5'])
  })

  test('modGlyph', () => {
    const theme = modGlyph(getTheme('thin'))(prefix('«prefix»'))('tee')
    expect(getGlyph(theme)('tee')).toBe('«prefix»┬')
  })

  test('suffixGlyph', () => {
    expect(suffixGlyph(getTheme('thin'))('tee')('foo')).toBe('foo┬')
  })
})
