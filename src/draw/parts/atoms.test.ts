import {Array, pipe, String} from '#util'
import {expect, test} from 'vitest'
import {drawPart, text} from '../part.js'
import {spacePad} from './atoms.js'

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
