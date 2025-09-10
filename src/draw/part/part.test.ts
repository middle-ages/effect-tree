import {describe, expect, test} from 'vitest'
import {String, Array, pipe} from 'effect'
import {bottomCenterRow, centerColumn, empty, text} from './data.js'
import {showPart} from './ops.js'
import type {Part} from './types.js'
import {draw} from './draw.js'
import {unlines} from '#util/String'

const [row, column] = [bottomCenterRow, centerColumn]

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
      pipe('foo', text, Array.of, row, testShowPart('no strut', '⮂⮇.(“foo”)'))

      pipe(
        row([text('foo')], [text('A'), [text('B')]]),
        testShowPart('with strut', '⮂⮇.[“A”](“foo”)'),
      )
    })

    describe('column', () => {
      pipe('foo', text, Array.of, column, testShowPart('no strut', '⮂.(“foo”)'))

      pipe(
        column([text('foo')], text('C')),
        testShowPart('with strut', '⮂.[“C”](“foo”)'),
      )
    })
  })
})

describe('draw part', () => {
  test('empty', () => {
    expect(draw(empty)).toEqual([])
  })

  test('text', () => {
    expect(draw(text('foo'))).toEqual(['foo'])
  })

  test('fractal', () => {
    const [full, space, empty] = [text('█'), text(' '), text('')]

    const init = row([space, full, space])

    const step = (part: Part) =>
      row([part, column([part, empty, empty], full), part])

    let i = 0
    let current = init
    while (i++ < 3) current = step(current)

    expect('\n' + unlines(Array.map(draw(current), String.trimEnd))).toEqual(`
                                        █
                                       ███
             █                 █     █ ███ █     █                 █
            ███               ███   █████████   ███               ███
    █     █ ███ █     █     █ ███ █ █████████ █ ███ █     █     █ ███ █     █
   ███   █████████   ███   ███████████████████████████   ███   █████████   ███
 █ ███ █ █████████ █ ███ █ ███████████████████████████ █ ███ █ █████████ █ ███ █`)
  })
})
