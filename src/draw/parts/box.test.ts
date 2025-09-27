import {Array, pipe, String} from '#util'
import {expect, test} from 'vitest'
import {drawPart} from '../part.js'
import {stackText} from './atoms.js'
import {box} from './box.js'
import {padding} from './pad.js'

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

test('lines', () => {
  const actual = box.lines({padding: padding(3, 1, 2, 1)})(
    ['A', 'BB', 'CCC', 'DDDD'],
    'center',
  )
  expect(drawPart(actual)).toEqual([
    '┌──────┐',
    '│      │',
    '│      │',
    '│      │',
    '│  A   │',
    '│  BB  │',
    '│ CCC  │',
    '│ DDDD │',
    '│      │',
    '│      │',
    '└──────┘',
  ])
})
