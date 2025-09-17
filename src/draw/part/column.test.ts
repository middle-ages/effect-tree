import {describe, expect, test} from 'vitest'
import {Array, flow, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {type HorizontalAlignment, showAlignment} from './align/data.js'
import {column, text} from './data.js'
import {draw} from './draw.js'
import type {Text} from './partF/data.js'
import type {Part} from './types.js'

type MakeColumn = (align?: HorizontalAlignment) => (hStrut?: Text) => Part

const makeColumn =
  (cells: Part[]): MakeColumn =>
  (align = 'left') =>
  (hStrut = text('•')) =>
    column(align)(cells, hStrut)

const [narrowText, wideText] = [text('foo'), text('123456')]

test('lineCount≔0', () => {
  expect(draw(makeColumn([])()())).toEqual([])
})

test('lineCount≔1', () => {
  expect(draw(makeColumn([narrowText])()())).toEqual(['foo'])
})

test('lineCount≔2', () => {
  expect(draw(makeColumn([narrowText, wideText])()())).toEqual([
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
    draw(makeColumn(oneToSixText)(align)())

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
