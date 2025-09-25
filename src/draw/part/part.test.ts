import {trimEnd, unlines} from '#String'
import {Array, pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {HStrut, Struts, VStrut} from '../struts.js'
import {column as dataColumn} from './column.js'
import {empty, text} from './data.js'
import {drawPart} from './draw.js'
import {row as dataRow} from './row.js'
import {showPart} from './show.js'
import type {Part} from './types.js'

const [row, column] = [dataRow.bottom.center, dataColumn.center]

const testShowPart = (name: string, expected: string) => (part: Part) => {
  test(name, () => {
    expect(showPart(part)).toEqual(expected)
  })
}

describe('part', () => {
  describe('showPart', () => {
    pipe(empty, testShowPart('empty', '∅'))
    pipe('foo', text, testShowPart('string', '“foo”'))

    describe('row', () => {
      pipe(
        'foo',
        text,
        Array.of,
        row,
        testShowPart('no strut', '⮂⮇.←⊦«“ ”»↑⊥«“”»(“foo”)'),
      )

      pipe(
        row([text('foo')], Struts(VStrut(['B']), HStrut(['A']))),
        testShowPart('with strut', '⮂⮇.←⊦«“A”»↑⊥«“B”»(“foo”)'),
      )
    })

    describe('column', () => {
      pipe(
        'foo',
        text,
        Array.of,
        column,
        testShowPart('no strut', '⮂←⊦«“ ”»(“foo”)'),
      )

      pipe(
        column([text('foo')], HStrut(['C'])),
        testShowPart('with strut', '⮂←⊦«“C”»(“foo”)'),
      )
    })
  })
})

describe('draw part', () => {
  test('empty', () => {
    expect(drawPart(empty)).toEqual([])
  })

  test('text', () => {
    expect(drawPart(text('foo'))).toEqual(['foo'])
  })

  test('fractal', () => {
    const [full, space, empty] = [text('█'), text(' '), text('')]

    const init = row([space, full, space])

    const step = (part: Part) =>
      row([part, column([part, empty, empty], HStrut(['█'])), part])

    let i = 0
    let current = init
    while (i++ < 3) current = step(current)

    expect('\n' + unlines(Array.map(drawPart(current), trimEnd))).toEqual(`
                                        █
                                       ███
             █                 █     █ ███ █     █                 █
            ███               ███   █████████   ███               ███
    █     █ ███ █     █     █ ███ █ █████████ █ ███ █     █     █ ███ █     █
   ███   █████████   ███   ███████████████████████████   ███   █████████   ███
 █ ███ █ █████████ █ ███ █ ███████████████████████████ █ ███ █ █████████ █ ███ █`)
  })
})
