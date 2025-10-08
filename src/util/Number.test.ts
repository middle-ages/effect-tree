import {repeat} from '#String'
import {describe, expect, test} from '@effect/vitest'
import {Array} from 'effect'
import {fromRadix, toRadix} from './Number.js'

describe('toRadix', () => {
  test('123 at base 10', () => {
    expect(toRadix(123n, 10)).toEqual([1, 2, 3])
  })

  test('8 binary', () => {
    expect(toRadix(8n, 2)).toEqual([1, 0, 0, 0])
  })

  test('256 base 16', () => {
    expect(toRadix(255n, 16)).toEqual([15, 15])
  })

  test('10⁶ base 16', () => {
    expect(toRadix(10n ** 6n, 16)).toEqual([15, 4, 2, 4, 0])
  })

  test('10 1s', () => {
    expect(toRadix(BigInt(repeat(10)('1')), 10)).toEqual(Array.replicate(10)(1))
  })

  test('88,888,888 in base 16', () => {
    expect(toRadix(BigInt(repeat(8)('8')), 16)).toEqual([5, 4, 12, 5, 6, 3, 8])
  })

  test('20²⁰ in base 20', () => {
    expect(toRadix(BigInt(20 ** 20), 20)).toEqual([
      1,
      ...Array.replicate(20)(0),
    ])
  })
})

describe('fromRadix', () => {
  test('123 at base 10', () => {
    expect(fromRadix([1, 2, 3], 10)).toEqual(123n)
  })

  test('8 binary', () => {
    expect(fromRadix([1, 0, 0, 0], 2)).toEqual(8n)
  })

  test('100 ‘99’ digit in base 100', () => {
    expect(fromRadix(Array.replicate(100)(99), 100).toString()).toEqual(
      repeat(100)('99'),
    )
  })
})

describe('round trip', () => {
  const run = (n: bigint, base: number) => {
    const digits = toRadix(n, base)
    const result = fromRadix(digits, base)
    test(`base=${base.toString()} n=${n.toString()}`, () => {
      expect(result).toEqual(n)
    })
  }

  run(1_000_000n, 10)
  run(1_000_000n, 2)
  run(1_000_000n, 16)
  run(25n ** 25n, 25)
  run(55n ** 55n, 55)
  run(10n ** 100n, 50)
  run(100n ** 100n, 100)
})
