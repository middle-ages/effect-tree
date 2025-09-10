import type {EndoOf} from '#util/Function'
import {Array, pipe, String} from 'effect'
import {describe, expect, test} from 'vitest'
import {atoms} from '../atoms.js'
import {getTheme, setIndents} from '../theme.js'
import type {Themed} from '../theme/types.js'
import {column, text} from './data.js'
import {draw} from './draw.js'
import type {Part} from './types.js'

const withTheme = <A>(f: Themed<A>): A => pipe('thin', getTheme, f)

describe('atoms', () => {
  describe('label', () => {
    test('leaf', () => {
      expect(pipe('foo', atoms.leafLabel, withTheme, draw)).toEqual(['─foo'])
    })

    test('leaf with no label', () => {
      expect(pipe('', atoms.leafLabel, withTheme, draw)).toEqual(['─'])
    })

    test('parent', () => {
      expect(pipe('foo', atoms.branchLabel, withTheme, draw)).toEqual(['┬foo'])
    })

    test('parent with no label', () => {
      expect(pipe('', atoms.branchLabel, withTheme, draw)).toEqual(['┬'])
    })
  })

  describe('branch', () => {
    const theme = (indent: number) => pipe('thin', getTheme, setIndents(indent))
    const part = column.left([text('A'), text('AB'), text('ABC')])
    const drawPart = (atom: EndoOf<Part>) =>
      pipe(part, atom, draw, Array.map(String.trimEnd))

    describe('head', () => {
      test('indent≔0', () => {
        expect(pipe(0, theme, atoms.headBranch, drawPart)).toEqual([
          '├A',
          '│AB',
          '│ABC',
        ])
      })

      test('indent≔2', () => {
        expect(pipe(2, theme, atoms.headBranch, drawPart)).toEqual([
          '├──A',
          '│  AB',
          '│  ABC',
        ])
      })
    })
  })
})
