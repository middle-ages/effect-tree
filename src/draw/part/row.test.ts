import {
  column,
  empty,
  HStrut,
  row,
  stackText,
  text,
  VStrut,
  type AreaStruts,
} from '#draw'
import {flow, Array, pipe, String} from '#util'
import {describe, expect, test} from 'vitest'
import {
  showAlignments,
  type HorizontalAlignment,
  type VerticalAlignment,
} from '../align.js'
import {drawPart} from './draw.js'
import type {Part} from './types.js'

const struts: AreaStruts = {
  hStrut: HStrut(['⊢']),
  vStrut: VStrut(['⊥'], ['+'], ['-']),
}

const makeRow = (
  cells: Part[],
  [hAlign, vAlign]: [HorizontalAlignment, VerticalAlignment] = ['left', 'top'],
): Part => row(vAlign)(hAlign)(cells, struts)

const [shortText, longText] = [text('«foo»'), text('«ABCDEF»')]

const shortColumn = (
  hAlign: HorizontalAlignment = 'left',
  hStrut = struts.hStrut,
) =>
  column(hAlign)(
    [text('«bar»'), column(hAlign)([text('«123456»'), text('«A»')], hStrut)],
    hStrut,
  )

test('empty row', () => {
  expect(drawPart(makeRow([]))).toEqual([])
})

test('row of empty part', () => {
  expect(drawPart(makeRow([empty]))).toEqual([])
})

test('row of empty text part', () => {
  expect(drawPart(makeRow([text('')]))).toEqual([''])
})

test('single text part', () => {
  expect(drawPart(makeRow([shortText]))).toEqual(['«foo»'])
})

test('two single row columns', () => {
  expect(drawPart(makeRow([shortText, longText]))).toEqual(['«foo»«ABCDEF»'])
})

describe('short column with single line text', () => {
  const row = (hAlign: HorizontalAlignment, vAlign: VerticalAlignment) =>
    makeRow([shortColumn(hAlign), shortText], [hAlign, vAlign])

  describe('top', () => {
    test('topLeft', () => {
      expect(drawPart(row('left', 'top'))).toEqual([
        '«bar»⊢⊢⊢«foo»',
        '«123456»+⊢⊢⊢⊢',
        '«A»⊢⊢⊢⊢⊢-⊢⊢⊢⊢',
      ])
    })
    test('topCenter', () => {
      expect(drawPart(row('center', 'top'))).toEqual([
        '⊢«bar»⊢⊢«foo»',
        '«123456»⊢⊢+⊢⊢',
        '⊢⊢«A»⊢⊢⊢⊢⊢-⊢⊢',
      ])
    })
    test('topRight', () => {
      expect(drawPart(row('right', 'top'))).toEqual([
        '⊢⊢⊢«bar»«foo»',
        '«123456»⊢⊢⊢⊢+',
        '⊢⊢⊢⊢⊢«A»⊢⊢⊢⊢-',
      ])
    })
  })

  describe('middle', () => {
    test('middleLeft', () => {
      expect(drawPart(row('left', 'middle'))).toEqual([
        '«bar»⊢⊢⊢+⊢⊢⊢⊢',
        '«123456»«foo»',
        '«A»⊢⊢⊢⊢⊢+⊢⊢⊢⊢',
      ])
    })
    test('middleCenter', () => {
      expect(drawPart(row('center', 'middle'))).toEqual([
        '⊢«bar»⊢⊢⊢⊢+⊢⊢',
        '«123456»«foo»',
        '⊢⊢«A»⊢⊢⊢⊢⊢+⊢⊢',
      ])
    })
    test('middleRight', () => {
      expect(drawPart(row('right', 'middle'))).toEqual([
        '⊢⊢⊢«bar»⊢⊢⊢⊢+',
        '«123456»«foo»',
        '⊢⊢⊢⊢⊢«A»⊢⊢⊢⊢+',
      ])
    })
  })

  describe('bottom', () => {
    test('bottomLeft', () => {
      expect(drawPart(row('left', 'bottom'))).toEqual([
        '«bar»⊢⊢⊢+⊢⊢⊢⊢',
        '«123456»-⊢⊢⊢⊢',
        '«A»⊢⊢⊢⊢⊢«foo»',
      ])
    })
    test('bottomCenter', () => {
      expect(drawPart(row('center', 'bottom'))).toEqual([
        '⊢«bar»⊢⊢⊢⊢+⊢⊢',
        '«123456»⊢⊢-⊢⊢',
        '⊢⊢«A»⊢⊢⊢«foo»',
      ])
    })
    test('bottomRight', () => {
      expect(drawPart(row('right', 'bottom'))).toEqual([
        '⊢⊢⊢«bar»⊢⊢⊢⊢+',
        '«123456»⊢⊢⊢⊢-',
        '⊢⊢⊢⊢⊢«A»«foo»',
      ])
    })
  })
})

describe('shorthand', () => {
  const text1 = text('A')
  const text4 = text('WXYZ')
  const text8 = pipe('12345678', text)

  const column4 = column.center(
    [text1, text8, text4, text1],
    HStrut(['▪'], '«', '»'),
  )

  const rowCells = [text1, column4, text4]

  const struts = {
    hStrut: HStrut(['━'], '╼', '╾'),
    vStrut: VStrut(['┆'], ['↑'], ['↓']),
  }

  const testRow = (
    hAlign: HorizontalAlignment,
    vAlign: VerticalAlignment,
    expected: string,
  ) => {
    test(`row.${showAlignments({hAlign, vAlign})}`, () => {
      expect(
        pipe(
          row(vAlign)(hAlign)(rowCells, struts),
          drawPart,
          String.unlines,
          String.prefix('\n'),
          String.replaceAll(' ', '.'),
        ),
      ).toBe(expected)
    })
  }

  describe('top', () => {
    testRow(
      'left',
      'top',
      `
A«▪»A«▪▪»WXYZ
↑12345678↑╼━╾
┆«»WXYZ«»┆╼━╾
↓«▪»A«▪▪»↓╼━╾`,
    )

    testRow(
      'center',
      'middle',
      `
↑«▪»A«▪▪»╼↑╼╾
↓12345678╼↓╼╾
A«»WXYZ«»WXYZ
↑«▪»A«▪▪»╼↑╼╾`,
    )

    testRow(
      'right',
      'middle',
      `
↑«▪»A«▪▪»╼━╾↑
↓12345678╼━╾↓
A«»WXYZ«»WXYZ
↑«▪»A«▪▪»╼━╾↑`,
    )
  })
})

describe('struts', () => {
  const cells = [text('1234567'), stackText.rest('a', 'b', 'c', 'EEE')]
  const iut = flow(
    row.middle.left,
    drawPart,
    Array.map(String.replaceAll(' ', '.')),
  )

  test('default struts', () => {
    expect(iut(cells)).toEqual([
      '........a.',
      '........b.',
      '1234567.c.',
      '.......EEE',
    ])
  })

  test('empty vertical strut', () => {
    expect(
      iut(cells, {
        hStrut: HStrut(['x'], '←', '→'),
        vStrut: VStrut.empty,
      }),
    ).toEqual(['←xxxxx→.a.', '←xxxxx→.b.', '1234567.c.', '←xxxxx→EEE'])
  })
})
