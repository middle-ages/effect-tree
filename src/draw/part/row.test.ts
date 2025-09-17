import {describe, expect, test} from 'vitest'
import type {NonEmptyArray} from 'effect/Array'
import {column, row, text} from './data.js'
import {draw} from './draw.js'
import {pipe, String} from '#util'
import type {Text} from './partF.js'
import type {Part} from './types.js'
import {
  forHorizontalAlignments,
  forVerticalAlignments,
  type HorizontalAlignment,
  type VerticalAlignment,
} from './align.js'

const struts: [Text, NonEmptyArray<Text>] = [
  text('⊢'),
  [text('⊥'), text('+'), text('-')],
]
const [defaultHStrut, defaultVStrut] = struts

const makeRow = (
  cells: Part[],
  [hAlign, vAlign]: [HorizontalAlignment, VerticalAlignment] = ['left', 'top'],
) => row(vAlign)(hAlign)(cells, [defaultHStrut, defaultVStrut])

const [shortText, longText] = [text('«foo»'), text('«ABCDEF»')]

const shortColumn = (
  hAlign: HorizontalAlignment = 'left',
  hStrut = defaultHStrut,
) =>
  column(hAlign)(
    [text('«bar»'), column(hAlign)([text('«123456»'), text('«A»')], hStrut)],
    hStrut,
  )

describe('draw row', () => {
  test('empty row', () => {
    expect(draw(makeRow([]))).toEqual([])
  })

  test('single text part', () => {
    expect(draw(makeRow([shortText]))).toEqual(['«foo»'])
  })

  test('two single row columns', () => {
    expect(draw(makeRow([shortText, longText]))).toEqual(['«foo»«ABCDEF»'])
  })

  describe('short column with single line text', () => {
    const row = (hAlign: HorizontalAlignment, vAlign: VerticalAlignment) =>
      makeRow([shortColumn(hAlign), shortText], [hAlign, vAlign])

    describe('top', () => {
      test('topLeft', () => {
        expect(draw(row('left', 'top'))).toEqual([
          '«bar»⊢⊢⊢«foo»',
          '«123456»⊥⊢⊢⊢⊢',
          '«A»⊢⊢⊢⊢⊢+⊢⊢⊢⊢',
        ])
      })
      test('topCenter', () => {
        expect(draw(row('center', 'top'))).toEqual([
          '⊢«bar»⊢⊢«foo»',
          '«123456»⊢⊢⊥⊢⊢',
          '⊢⊢«A»⊢⊢⊢⊢⊢+⊢⊢',
        ])
      })
      test('topRight', () => {
        expect(draw(row('right', 'top'))).toEqual([
          '⊢⊢⊢«bar»«foo»',
          '«123456»⊢⊢⊢⊢⊥',
          '⊢⊢⊢⊢⊢«A»⊢⊢⊢⊢+',
        ])
      })
    })

    describe('middle', () => {
      test('middleLeft', () => {
        expect(draw(row('left', 'middle'))).toEqual([
          '«bar»⊢⊢⊢⊥⊢⊢⊢⊢',
          '«123456»«foo»',
          '«A»⊢⊢⊢⊢⊢⊥⊢⊢⊢⊢',
        ])
      })
      test('middleCenter', () => {
        expect(draw(row('center', 'middle'))).toEqual([
          '⊢«bar»⊢⊢⊢⊢⊥⊢⊢',
          '«123456»«foo»',
          '⊢⊢«A»⊢⊢⊢⊢⊢⊥⊢⊢',
        ])
      })
      test('middleRight', () => {
        expect(draw(row('right', 'middle'))).toEqual([
          '⊢⊢⊢«bar»⊢⊢⊢⊢⊥',
          '«123456»«foo»',
          '⊢⊢⊢⊢⊢«A»⊢⊢⊢⊢⊥',
        ])
      })
    })

    describe('bottom', () => {
      test('bottomLeft', () => {
        expect(draw(row('left', 'bottom'))).toEqual([
          '«bar»⊢⊢⊢⊥⊢⊢⊢⊢',
          '«123456»+⊢⊢⊢⊢',
          '«A»⊢⊢⊢⊢⊢«foo»',
        ])
      })
      test('bottomCenter', () => {
        expect(draw(row('center', 'bottom'))).toEqual([
          '⊢«bar»⊢⊢⊢⊢⊥⊢⊢',
          '«123456»⊢⊢+⊢⊢',
          '⊢⊢«A»⊢⊢⊢«foo»',
        ])
      })
      test('bottomRight', () => {
        expect(draw(row('right', 'bottom'))).toEqual([
          '⊢⊢⊢«bar»⊢⊢⊢⊢⊥',
          '«123456»⊢⊢⊢⊢+',
          '⊢⊢⊢⊢⊢«A»«foo»',
        ])
      })
    })
  })

  describe('shorthand', () => {
    const testDraw = (name: string, actual: Part, expected: string) => {
      test(name, () => {
        expect(pipe(actual, draw, String.unlines, String.prefix('\n'))).toBe(
          expected,
        )
      })
    }

    const t1 = text('1')
    const t2 = text('22')
    const t3 = text('333')

    const c2 = column.left([t1, t2], text('.'))

    describe('single row', () => {
      forVerticalAlignments(vertical => {
        forHorizontalAlignments(horizontal => {
          testDraw(
            `row.${vertical}.${horizontal}`,
            row[vertical][horizontal]([t1, t2, t3], struts),
            `
122333`,
          )
        })
      })
    })

    describe('two rows', () => {
      testDraw(
        'row.top.left',
        row.top.left([t1, t2, t3, c2], struts),
        `
1223331.
⊥⊥⊢⊥⊢⊢22`,
      )

      testDraw(
        'row.top.center',
        row.top.center([t1, t2, t3, c2], struts),
        `
1223331.
⊥⊥⊢⊢⊥⊢22`,
      )

      testDraw(
        'row.top.right',
        row.top.right([t1, t2, t3, c2], struts),
        `
1223331.
⊥⊢⊥⊢⊢⊥22`,
      )
    })
  })
})
