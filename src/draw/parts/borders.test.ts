import {pipe, String} from '#util'
import {describe, expect, test} from 'vitest'
import {borderSet, type BorderSet} from '../glyph.js'
import {drawPart, text, type Part} from '../part.js'
import {hPadPart, stackText} from './atoms.js'
import {
  addBorder,
  addBorders,
  borderBottom,
  borderLeft,
  borderRight,
  borderTop,
  hBorders,
  vBorders,
} from './borders.js'

const expectDraw = (part: Part) => (expected: string) => {
  expect(
    pipe(
      part,
      drawPart,
      String.unlines,
      String.prefix('\n'),
      String.replaceAll(' ', '.'),
    ),
  ).toBe(expected)
}

const set: BorderSet = borderSet('thin')
const tenWide: Part = text('0123456789')
const stackedText: Part = stackText(['A', 'BB', 'CCC'])

test('borderTop', () => {
  expectDraw(borderTop(set)(tenWide))(`
──────────
0123456789`)
})

test('borderBottom', () => {
  expectDraw(borderBottom(set)(tenWide))(
    `
0123456789
──────────`,
  )
})

test('borderBottom on stackText', () => {
  expectDraw(borderBottom(set)(stackedText))(
    `
.A.
BB.
CCC
───`,
  )
})

test('borderLeft', () => {
  expectDraw(borderLeft(set)(stackedText))(
    `
│.A.
│BB.
│CCC`,
  )
})

test('borderRight', () => {
  expectDraw(borderRight(set)(stackedText))(
    `
.A.│
BB.│
CCC│`,
  )
})

test('hBorders', () => {
  expectDraw(hBorders(set)(stackedText))(
    `
│.A.│
│BB.│
│CCC│`,
  )
})

test('vBorders', () => {
  expectDraw(vBorders(set)(stackedText))(
    `
───
.A.
BB.
CCC
───`,
  )
})

test('borderTop.corners', () => {
  expectDraw(pipe(tenWide, hPadPart()(), borderTop.corners(set)))(
    `
┌──────────┐
.0123456789.`,
  )
})

test('borderBottom.corners', () => {
  expectDraw(pipe(tenWide, hPadPart()(), borderBottom.corners(set)))(
    `
.0123456789.
└──────────┘`,
  )
})

describe('addBorder', () => {
  test('single line', () => {
    expectDraw(addBorder(text('foo'), borderSet('thin')))(
      `
┌───┐
│foo│
└───┘`,
    )
  })

  test('two lines', () => {
    expectDraw(addBorder(stackText.rest('foo', 'bar'), borderSet('thin')))(
      `
┌───┐
│foo│
│bar│
└───┘`,
    )
  })
})

test('addBorders', () => {
  pipe(
    'foo',
    text,
    pipe([borderSet('thin'), borderSet('thick')], addBorders),
    expectDraw,
  )(`
┏━━━━━┓
┃┌───┐┃
┃│foo│┃
┃└───┘┃
┗━━━━━┛`)
})

test('addBorders.rest', () => {
  pipe(
    'foo',
    text,
    addBorders.rest(borderSet('thick'), borderSet('thin')),
    expectDraw,
  )(`
┌─────┐
│┏━━━┓│
│┃foo┃│
│┗━━━┛│
└─────┘`)
})
