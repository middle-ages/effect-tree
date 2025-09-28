import {monoRecord} from '#Record'
import {describe, expect, test} from 'vitest'
import {directions} from '../direction.js'
import {HStrut, VStrut} from '../struts.js'
import {
  padding,
  addPadHeight,
  addPadSize,
  addPadWidth,
  computePadSize,
  normalizePadded,
} from './pad.js'

describe('normalizedPadded', () => {
  test('empty', () => {
    expect(normalizePadded()).toEqual({
      pad: monoRecord(0)(...directions),
      padStruts: {
        top: VStrut.empty,
        right: HStrut.space,
        bottom: VStrut.empty,
        left: HStrut.space,
      },
    })
  })

  test('non-empty', () => {
    expect(
      normalizePadded({
        pad: {top: 42},
        padStruts: {left: HStrut(['left'])},
      }),
    ).toEqual({
      pad: {...monoRecord(0)(...directions), top: 42},
      padStruts: {
        left: HStrut(['left']),
        right: HStrut.space,
        top: VStrut.empty,
        bottom: VStrut.empty,
      },
    })
  })
})

test('computePadSize', () => {
  expect(
    computePadSize(
      normalizePadded({pad: {top: 1, right: 2, bottom: 4, left: 8}}),
    ),
  ).toEqual([10, 5])
})

test('addPadSize', () => {
  expect(
    addPadSize(normalizePadded({pad: {top: 1, right: 2, bottom: 4, left: 8}}))(
      100,
      1000,
    ),
  ).toEqual([110, 1005])
})

test('addPadWidth', () => {
  expect(
    addPadWidth(normalizePadded({pad: {top: 0, right: 2, bottom: 0, left: 1}}))(
      3,
    ),
  ).toBe(6)
})

test('addPadHeight', () => {
  expect(
    addPadHeight(
      normalizePadded({pad: {top: 1, right: 0, bottom: 2, left: 0}}),
    )(3),
  ).toBe(6)
})

describe('padding', () => {
  test('one argument', () => {
    expect(padding(42)).toEqual({top: 42, right: 42, bottom: 42, left: 42})
  })

  test('two arguments', () => {
    expect(padding(42, 43)).toEqual({top: 42, right: 43, bottom: 42, left: 43})
  })

  test('three arguments', () => {
    expect(padding(42, 43, 44)).toEqual({
      top: 42,
      right: 43,
      bottom: 44,
      left: 43,
    })
  })

  test('three arguments', () => {
    expect(padding(42, 43, 44, 45)).toEqual({
      top: 42,
      right: 43,
      bottom: 44,
      left: 45,
    })
  })
})
