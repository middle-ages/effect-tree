import {Indented} from '#codec'
import {stringTree} from '#test'
import {branch, of, type Tree} from '#tree'
import {String} from '#util'
import type {Array} from 'effect'
import {describe, expect, test} from 'vitest'

describe('encode', () => {
  const iut: (self: Tree<string>) => Array.NonEmptyArray<string> =
    Indented.encode(2)

  test('leaf', () => {
    expect(iut(of('A'))).toEqual(['A'])
  })

  test('string tree', () => {
    expect(`\n` + String.unlines(iut(stringTree))).toBe(`
1
  1.1
  1.2
    1.2.1
    1.2.2
    1.2.3
  1.3
    1.3.1
      1.3.1.1
        1.3.1.1.1
  1.4`)
  })
})

describe('decode', () => {
  test('leaf', () => {
    expect(Indented.decode(['A'])).toEqual(of('A'))
  })

  test('levels≔2, nodeCount≔3', () => {
    expect(Indented.decode(['A', ' B', ' C'])).toEqual(
      branch('A', [of('B'), of('C')]),
    )
  })

  test('string tree', () => {
    expect(
      Indented.decode([
        '1',
        ' 1.1',
        ' 1.2',
        '  1.2.1',
        '  1.2.2',
        '  1.2.3',
        ' 1.3',
        '  1.3.1',
        '   1.3.1.1',
        '    1.3.1.1.1',
        ' 1.4',
      ]),
    ).toEqual(stringTree)
  })
})
