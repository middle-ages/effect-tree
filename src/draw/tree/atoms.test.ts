import {describe, expect, test} from 'vitest'
import {column, drawPart, text} from '../part.js'
import {branchLabel, headBranch, leafLabel, tailBranch} from './atoms.js'
import {glyphSet} from './glyph.js'
import {Theme} from './theme.js'

const theme = Theme({glyphs: glyphSet('thin')})

describe('label', () => {
  test('leaf', () => {
    const actual = leafLabel('foo')(theme)
    expect(drawPart(actual)).toEqual(['─foo'])
  })

  test('leaf with no label', () => {
    expect(drawPart(leafLabel('')(theme))).toEqual(['─'])
  })

  test('parent', () => {
    expect(drawPart(branchLabel('foo')(theme))).toEqual(['┬foo'])
  })

  test('parent with no label', () => {
    expect(drawPart(branchLabel('')(theme))).toEqual(['┬'])
  })
})

describe('parent', () => {
  const part = column.left([text('A'), text('AB'), text('ABC')])
  describe('headBranch', () => {
    test('basic', () => {
      const branch = headBranch(theme)(part)
      expect(drawPart(branch)).toEqual([
        //
        '├A  ',
        '│AB ',
        '│ABC',
      ])
    })

    test('with indents', () => {
      const branch = headBranch({...theme, indents: 4})(part)
      expect(drawPart(branch)).toEqual([
        //
        '├────A  ',
        '│    AB ',
        '│    ABC',
      ])
    })
  })

  test('tailBranch', () => {
    const branch = tailBranch(theme)(part)
    expect(drawPart(branch)).toEqual([
      //
      '└A  ',
      ' AB ',
      ' ABC',
    ])
  })
})
