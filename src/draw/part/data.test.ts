import {describe, expect, test} from 'vitest'
import {
  above,
  after,
  before,
  below,
  prefixText,
  row,
  suffixText,
  text,
} from './data.js'
import {showPart} from './ops.js'
import {pipe} from 'effect'

const [prefix, suffix] = [text('prefix-'), text('-suffix')]

describe('data', () => {
  test('prefixText', () => {
    expect(prefixText(prefix)(suffix)).toEqual(text('prefix--suffix'))
  })

  test('suffixText', () => {
    expect(suffixText(suffix)(prefix)).toEqual(text('prefix--suffix'))
  })

  test('before', () => {
    expect(showPart(before('top')('left')(prefix)(suffix))).toBe(
      '⮄⮅.(“prefix-”, “-suffix”)',
    )
  })

  test('before with hStrut', () => {
    expect(showPart(before('top')('left')(prefix, [text('h')])(suffix))).toBe(
      '⮄⮅.[“h”](“prefix-”, “-suffix”)',
    )
  })

  test('before with vStrut', () => {
    expect(
      showPart(
        before('top')('left')(prefix, [text('h'), [text('v1'), text('v2')]])(
          suffix,
        ),
      ),
    ).toBe('⮄⮅.[“h”](“prefix-”, “-suffix”)')
  })

  test('after', () => {
    expect(showPart(after('middle')('left')(suffix)(prefix))).toBe(
      '⮄⮁.(“prefix-”, “-suffix”)',
    )
  })

  test('after with hStrut', () => {
    expect(showPart(after('middle')('left')(suffix, [text('h')])(prefix))).toBe(
      '⮄⮁.[“h”](“prefix-”, “-suffix”)',
    )
  })

  test('below', () => {
    expect(pipe(suffix, below('right')(prefix), showPart)).toBe(
      '⮆.(“prefix-”, “-suffix”)',
    )
  })

  test('above', () => {
    expect(pipe(prefix, above('center')(suffix), showPart)).toBe(
      '⮂.(“prefix-”, “-suffix”)',
    )
  })

  test('row with hStrut', () => {
    expect(showPart(row('top')('left')([prefix, suffix], [text('h')]))).toBe(
      '⮄⮅.[“h”](“prefix-”, “-suffix”)',
    )
  })
})
