import {describe, expect, test} from '@effect/vitest'
import {
  fromNumber,
  prefix,
  suffix,
  surround,
  toLowerCaseFirst,
  unlines,
  unwords,
  takeWhile,
} from './String.js'

describe('String', () => {
  describe('surround', () => {
    test('basic', () => {
      expect(surround(['[', ']'])('foo')).toBe('[foo]')
    })

    test('rest', () => {
      expect(surround.rest('[', ']')('foo')).toBe('[foo]')
    })

    describe('quote', () => {
      test('basic', () => {
        expect(surround.quote('foo')).toBe("'foo'")
      })

      test('double', () => {
        expect(surround.quote.double('foo')).toBe('"foo"')
      })

      test('fancy', () => {
        expect(surround.quote.fancy('foo')).toBe('“foo”')
      })
    })
  })

  test('prefix', () => {
    expect(prefix('+')('foo')).toBe('+foo')
  })

  test('suffix', () => {
    expect(suffix('+')('foo')).toBe('foo+')
  })

  test('toLowerCaseFirst', () => {
    expect(toLowerCaseFirst('FooBar')).toBe('fooBar')
  })

  describe('unwords', () => {
    test('basic', () => {
      expect(unlines(['a', 'b', 'c'])).toBe('a\nb\nc')
    })

    test('rest', () => {
      expect(unlines.rest('a', 'b', 'c')).toBe('a\nb\nc')
    })
  })

  describe('unwords', () => {
    test('basic', () => {
      expect(unwords(['a', 'b', 'c'])).toBe('abc')
    })

    test('rest', () => {
      expect(unwords.rest('a', 'b', 'c')).toBe('abc')
    })

    describe('unwords', () => {
      test('basic', () => {
        expect(unwords.spaced(['a', 'b', 'c'])).toBe('a b c')
      })

      test('rest', () => {
        expect(unwords.spaced.rest('a', 'b', 'c')).toBe('a b c')
      })
    })

    describe('comma', () => {
      test('basic', () => {
        expect(unwords.comma(['a', 'b', 'c'])).toBe('a, b, c')
      })

      test('rest', () => {
        expect(unwords.comma.rest('a', 'b', 'c')).toBe('a, b, c')
      })
    })

    describe('quote', () => {
      test('basic', () => {
        expect(unwords.quote(['a', 'b', 'c'])).toBe("'a', 'b', 'c'")
      })

      test('double', () => {
        expect(unwords.quote.double(['a', 'b', 'c'])).toBe('"a", "b", "c"')
      })

      test('fancy', () => {
        expect(unwords.quote.fancy(['a', 'b', 'c'])).toBe('“a”, “b”, “c”')
      })
    })
  })

  test('fromNumber', () => {
    expect(fromNumber(123)).toBe('123')
  })

  describe('takeWhile', () => {
    const iut = takeWhile(s => s === '-')

    test('non empty', () => {
      expect(iut('---a-foo')).toBe('---')
    })

    test('empty string', () => {
      expect(iut('')).toBe('')
    })

    test('match all', () => {
      expect(iut('--')).toBe('--')
    })

    test('match none', () => {
      expect(iut('foo')).toBe('')
    })
  })
})
