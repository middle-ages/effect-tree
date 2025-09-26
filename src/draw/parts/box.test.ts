import {Array, pipe, String} from '#util'
import {expect, test} from 'vitest'
import {drawPart} from '../part.js'
import {stackText} from './atoms.js'
import {box} from './box.js'

test('default settings', () => {
  expect(
    pipe(
      ['foo', 'bar', 'baz'],
      stackText,
      box.curried(),
      drawPart,
      Array.map(String.replaceAll(' ', '.')),
    ),
  ).toEqual(['┌───┐', '│foo│', '│bar│', '│baz│', '└───┘'])
})
