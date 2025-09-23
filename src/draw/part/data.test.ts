import {expect, test} from 'vitest'
import {HStrut, VStrut} from '../struts.js'
import {prefixText, suffixText, text} from './data.js'
import {after, before, row} from './row.js'
import {showPart} from './show.js'
import {above, below} from './column.js'

const [prefix, suffix] = [text('prefix-'), text('-suffix')]

test('prefixText', () => {
  expect(prefixText(prefix)(suffix)).toEqual(text('prefix--suffix'))
})

test('suffixText', () => {
  expect(suffixText(suffix)(prefix)).toEqual(text('prefix--suffix'))
})

test('before', () => {
  expect(showPart(before('top')('left')(suffix)(prefix))).toBe(
    '⮄⮅.←⊦«“ ”»↑⊥«“”»(“prefix-”, “-suffix”)',
  )
})

test('before with hStrut', () => {
  expect(
    showPart(before('top')('left')(suffix, {top: VStrut(['v'])})(prefix)),
  ).toBe('⮄⮅.←⊦«“ ”»↑⊥«“v”»↓⊥«“”»(“prefix-”, “-suffix”)')
})

test('before with vStrut', () => {
  expect(
    showPart(
      before('top')('left')(suffix, {
        left: HStrut(['h']),
        top: VStrut(['v'], ['v₀'], ['vₙ']),
      })(prefix),
    ),
  ).toBe('⮄⮅.←⊦«“h”»→⊦«“ ”»↑⊥v₀«“v”»vₙ↓⊥«“”»(“prefix-”, “-suffix”)')
})

test('after', () => {
  expect(showPart(after()()(prefix)(suffix))).toBe(
    '⮂⮁.←⊦«“ ”»↑⊥«“”»(“prefix-”, “-suffix”)',
  )
})

test('after with hStrut', () => {
  expect(showPart(after()('left')(prefix, {top: VStrut(['v'])})(suffix))).toBe(
    '⮄⮁.←⊦«“ ”»↑⊥«“v”»↓⊥«“”»(“prefix-”, “-suffix”)',
  )
})

test('below', () => {
  expect(showPart(below()(prefix)(suffix))).toBe(
    '⮂←⊦«“ ”»(“prefix-”, “-suffix”)',
  )
})

test('above', () => {
  expect(showPart(above()(suffix)(prefix))).toBe(
    '⮂←⊦«“ ”»(“prefix-”, “-suffix”)',
  )
})

test('row with hStrut', () => {
  expect(showPart(row.top.left([prefix, suffix], {left: HStrut(['h'])}))).toBe(
    '⮄⮅.←⊦«“h”»→⊦«“ ”»↑⊥«“”»(“prefix-”, “-suffix”)',
  )
})
