import {Array, pipe, String} from '#util'
import {expect, test} from 'vitest'
import {drawPart, text} from '../part.js'
import {
  repeatText,
  stackText,
  joinText,
  padPart,
  hPadPart,
  vIndent,
  vPadPart,
} from './atoms.js'

test('padPart', () => {
  expect(
    pipe(
      'foo',
      text,
      padPart({top: 1, right: 2, bottom: 3, left: 4}),
      drawPart,
      Array.map(String.replaceAll(' ', '.')),
    ),
  ).toEqual(['.........', '....foo..', '.........', '.........', '.........'])
})

test('joinText', () => {
  expect(drawPart(joinText(['A', 'B', 'C'], '.'))).toEqual(['A.B.C'])
})

test('joinText.curried', () => {
  expect(drawPart(joinText.curried('.')(['A', 'B', 'C']))).toEqual(['A.B.C'])
})

test('stackText', () => {
  expect(drawPart(stackText(['A', 'BB', 'CCC'], 'right'))).toEqual([
    '  A',
    ' BB',
    'CCC',
  ])
})

test('stackText.rest', () => {
  expect(drawPart(stackText.rest('CCC', 'A'))).toEqual(['CCC', ' A '])
})

test('stackText.curried', () => {
  expect(drawPart(stackText.curried('right')(['A', 'BB', 'CCC']))).toEqual([
    '  A',
    ' BB',
    'CCC',
  ])
})

test('repeatText', () => {
  expect(drawPart(repeatText(3, 'X'))).toEqual(['XXX'])
})

test('vIndent', () => {
  expect(drawPart(vIndent(3))).toEqual(['', '', ''])
})

test('hPadPart', () => {
  const padded = hPadPart('a', 'b')(1)(text('X'))

  expect(drawPart(padded)).toEqual(['aXb'])
})

test('hPadPart.left', () => {
  const padded = hPadPart.left('a', 1)(text('X'))

  expect(drawPart(padded)).toEqual(['aX'])
})

test('hPadPart.right', () => {
  const padded = hPadPart.right('b', 1)(text('X'))

  expect(drawPart(padded)).toEqual(['Xb'])
})

test('vPadPart', () => {
  const padded = vPadPart(1, 2)(text('X'))

  expect(drawPart(padded)).toEqual([' ', 'X', ' ', ' '])
})

test('vPadPart.top', () => {
  const padded = vPadPart.top(text('X'), 1)
  expect(drawPart(padded)).toEqual([' ', 'X'])
})

test('vPadPart.bottom', () => {
  const padded = vPadPart.bottom(text('X'), 1)
  expect(drawPart(padded)).toEqual(['X', ' '])
})
