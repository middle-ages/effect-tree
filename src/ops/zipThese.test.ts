import {from, of} from '#tree'
import {both, left, right} from '#These'
import {Option} from 'effect'
import {describe, expect, test} from 'vitest'
import {unzipThese, zipThese} from './zipThese.js'

describe('zipThese', () => {
  describe('congruent', () => {
    test('leaves', () => {
      expect(zipThese(of(1), of(2))).toEqual(of(both(2, 1)))
    })

    test('branch', () => {
      expect(zipThese(from(1, of(2)), from(3, of(4)))).toEqual(
        from(both(3, 1), of(both(4, 2))),
      )
    })
  })
})

describe('non-congruent', () => {
  test('leaf and branch', () => {
    expect(zipThese(from(1, of(2)), of(3))).toEqual(
      from(both(3, 1), of(right(2))),
    )
  })

  test('branch and leaf', () => {
    expect(zipThese(of(3), from(1, of(2)))).toEqual(
      from(both(1, 3), of(left(2))),
    )
  })

  describe('two branches', () => {
    test('left bigger', () => {
      expect(
        zipThese(from(1, from(2, from(3, of(4)))), from(5, from(6, of(7)))),
      ).toEqual(
        from(both(5, 1), from(both(6, 2), from(both(7, 3), of(right(4))))),
      )
    })

    test('right bigger', () => {
      expect(
        zipThese(from(5, from(6, of(7))), from(1, from(2, from(3, of(4))))),
      ).toEqual(
        from(both(1, 5), from(both(2, 6), from(both(3, 7), of(left(4))))),
      )
    })

    test('right deeper', () => {
      expect(zipThese(from(1, of(2)), from(3, of(4), of(5)))).toEqual(
        from(both(3, 1), of(both(4, 2)), of(left(5))),
      )
    })

    test('left deeper', () => {
      expect(zipThese(from(3, of(4), of(5)), from(1, of(2)))).toEqual(
        from(both(1, 3), of(both(2, 4)), of(right(5))),
      )
    })
  })
})

describe('unzipThese', () => {
  test('leaves', () => {
    expect(unzipThese(of(both(1, 2)))).toEqual([
      Option.some(of(2)),
      Option.some(of(1)),
    ])
  })

  test('branch and leaf', () => {
    expect(unzipThese(from(both(3, 1), of(left(2))))).toEqual([
      Option.some(from(1, of(2))),
      Option.some(of(3)),
    ])
  })

  test('leaf and branch', () => {
    expect(unzipThese(from(right(3), of(both(1, 2))))).toEqual([
      Option.some(from(3, of(1))),
      Option.none(),
    ])
  })
})
