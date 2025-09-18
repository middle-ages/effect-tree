import {describe, expect, test} from 'vitest'
import {HStrut, VStrut} from './index.js'

const hFill = HStrut.fill
const vFill = VStrut.fill

describe('hStrut', () => {
  const iut = hFill(HStrut(['1', '2', '3'], '←', '→'))

  test('basic', () => {
    expect(iut(7)).toBe('←12312→')
  })

  test('available=required', () => {
    expect(iut(5)).toBe('←123→')
  })

  test('available for body=0', () => {
    expect(iut(2)).toBe('←→')
  })

  test('single space available', () => {
    expect(iut(1)).toBe('←')
  })

  test('no space available', () => {
    expect(iut(0)).toBe('')
  })
})

describe('vStrut', () => {
  const iut = vFill(VStrut(['1', '2', '3'], ['↑'], ['↓']))

  test('basic', () => {
    expect(iut(7)).toEqual(['↑', '1', '2', '3', '1', '2', '↓'])
  })

  test('available=required', () => {
    expect(iut(5)).toEqual(['↑', '1', '2', '3', '↓'])
  })

  test('available for body=0', () => {
    expect(iut(2)).toEqual(['↑', '↓'])
  })

  test('single space available', () => {
    expect(iut(1)).toEqual(['↑'])
  })

  test('no space available', () => {
    expect(iut(0)).toEqual([])
  })
})
