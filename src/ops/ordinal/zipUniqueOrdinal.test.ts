import {Option, String, type Array} from 'effect'
import {describe, expect, test} from 'vitest'
import {zipUniqueOrdinal} from './zipUniqueOrdinal.js'

const options: Array.NonEmptyArray<Option.Option<string>> = [
  Option.some('I'),
  Option.none(),
  Option.some('II'),
  Option.some('II'),
  Option.some('II'),
  Option.some('II'),
  Option.some('III'),
  Option.some('III'),
  Option.some('III'),
  Option.none(),
  Option.some('IV'),
  Option.some('IV'),
  Option.none(),
  Option.none(),
  Option.some('V'),
  Option.some('VI'),
  Option.some('VII'),
  Option.some('VII'),
  Option.none(),
  Option.some('VIII'),
]

describe('zipUniqueOrdinal', () => {
  test('basic', () => {
    const actual = zipUniqueOrdinal(String.Order)(3)(options)
    expect(actual).toEqual([
      [
        Option.some(['I', 4]),
        Option.none(),
        Option.some(['II', 5]),
        Option.some(['II', 5]),
        Option.some(['II', 5]),
        Option.some(['II', 5]),
        Option.some(['III', 6]),
        Option.some(['III', 6]),
        Option.some(['III', 6]),
        Option.none(),
        Option.some(['IV', 7]),
        Option.some(['IV', 7]),
        Option.none(),
        Option.none(),
        Option.some(['V', 8]),
        Option.some(['VI', 9]),
        Option.some(['VII', 10]),
        Option.some(['VII', 10]),
        Option.none(),
        Option.some(['VIII', 11]),
      ],
      11,
    ])
  })

  test('surrounded by none', () => {
    const actual = zipUniqueOrdinal(String.Order)(0)([
      Option.none(),
      Option.some('I'),
      Option.some('II'),
      Option.none(),
    ])

    expect(actual).toEqual([
      [
        Option.none(),
        Option.some(['I', 1]),
        Option.some(['II', 2]),
        Option.none(),
      ],
      2,
    ])
  })
})
