import {Array, pipe, String} from '#util'
import {expect, test} from 'vitest'
import {drawPart, text} from '../part.js'
import {
  repeatText,
  stackText,
  joinText,
  spacePad,
  hSpace,
  vIndent,
  vSpace,
} from './atoms.js'

test('spacePad', () => {
  expect(
    pipe(
      'foo',
      text,
      spacePad({top: 1, right: 2, bottom: 3, left: 4}),
      drawPart,
      Array.map(String.replaceAll(' ', '.')),
    ),
  ).toEqual(['.........', '....foo..', '.........', '.........', '.........'])
})

test('joinText', () => {
  expect(drawPart(joinText(['A', 'B', 'C'], '.'))).toEqual(['A.B.C'])
})

test('stackText', () => {
  expect(drawPart(stackText(['A', 'BB', 'CCC'], 'right'))).toEqual([
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

test('hSpace', () => {
  const padded = hSpace('a', 'b')(1)(text('X'))

  expect(drawPart(padded)).toEqual(['aXb'])
})

test('vSpace', () => {
  const padded = vSpace(1, 2)(text('X'))

  expect(drawPart(padded)).toEqual([' ', 'X', ' ', ' '])
})
