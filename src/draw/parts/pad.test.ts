import {monoRecord} from '#Record'
import {expect, test} from 'vitest'
import {HStrut, VStrut} from '../struts.js'
import {addPadSize, computePadSize, normalizePadded} from './pad.js'
import {directions} from '../direction.js'

test('normalizedPadded', () => {
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
