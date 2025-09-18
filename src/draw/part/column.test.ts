import {column, text} from '#draw'
import {Array, flow, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {describe, expect, test} from 'vitest'
import {type HorizontalAlignment, showAlignment} from '../align.js'
import {HStrut} from '../struts.js'
import {drawPart} from './draw.js'
import type {Part, Text} from './types.js'

type MakeColumn = (align?: HorizontalAlignment) => (hStrut?: HStrut) => Part

const makeColumn =
  (cells: Part[]): MakeColumn =>
  (align = 'left') =>
  (hStrut = HStrut(['•'])) =>
    column(align)(cells, hStrut)

const [narrowText, wideText] = [text('foo'), text('123456')]

test('lineCount≔0', () => {
  expect(drawPart(makeColumn([])()())).toEqual([])
})

test('lineCount≔1', () => {
  expect(drawPart(makeColumn([narrowText])()())).toEqual(['foo'])
})

test('lineCount≔2', () => {
  expect(drawPart(makeColumn([narrowText, wideText])()())).toEqual([
    'foo•••',
    '123456',
  ])
})

describe('lineCount≔6', () => {
  // The list of strings “1”, “12”, “123”, … , “123456”,
  const oneToSixText: NonEmptyArray<Text> = pipe(
    Array.range(2, 6),
    Array.scan([1], (xs, x) => [...xs, x]),
    Array.map(Array.map(s => s.toString())),
    Array.map(flow(Array.join(''), text)),
  )

  const render = (align: HorizontalAlignment): string[] =>
    drawPart(makeColumn(oneToSixText)(align)())

  test(showAlignment('left'), () => {
    expect(render('left')).toEqual([
      '1•••••',
      '12••••',
      '123•••',
      '1234••',
      '12345•',
      '123456',
    ])
  })

  test(showAlignment('center'), () => {
    expect(render('center')).toEqual([
      '••1•••',
      '••12••',
      '•123••',
      '•1234•',
      '12345•',
      '123456',
    ])
  })

  test(showAlignment('right'), () => {
    expect(render('right')).toEqual([
      '•••••1',
      '••••12',
      '•••123',
      '••1234',
      '•12345',
      '123456',
    ])
  })
})
