import {expect, test} from 'vitest'
import {borderSet, replaceBorderElbow, replaceBorderLine} from './borders.js'
import {elbowSet, replaceElbow} from './elbows.js'
import {lineSet, replaceLine} from './lines.js'
import {replaceTee, teeSet} from './tees.js'
import type {BorderSet} from './types.js'

const lines = lineSet('dashed')
const elbows = elbowSet('thick')
const tees = teeSet('double')
const borders: BorderSet = {lines, elbows}

test('replaceLine', () => {
  expect(replaceLine('top', borderSet('thin').lines.top)(lines)).toEqual({
    top: borderSet('thin').lines.top,
    right: lines.right,
    bottom: lines.bottom,
    left: lines.left,
  })
})

test('replaceLine.named', () => {
  expect(
    replaceLine.named('top', borderSet('thin').lines.top)('dashed'),
  ).toEqual({
    top: borderSet('thin').lines.top,
    right: lines.right,
    bottom: lines.bottom,
    left: lines.left,
  })
})

test('replaceElbow', () => {
  expect(
    replaceElbow(elbows, 'bottomRight', borderSet('thin').elbows.bottomRight),
  ).toEqual({
    topLeft: elbows.topLeft,
    topRight: elbows.topRight,
    bottomRight: borderSet('thin').elbows.bottomRight,
    bottomLeft: elbows.bottomLeft,
  })
})

test('replaceElbow.named', () => {
  expect(
    replaceElbow.named(
      'bottomRight',
      borderSet('thin').elbows.bottomRight,
    )('thick'),
  ).toEqual({
    topLeft: elbows.topLeft,
    topRight: elbows.topRight,
    bottomRight: borderSet('thin').elbows.bottomRight,
    bottomLeft: elbows.bottomLeft,
  })
})

test('replaceTee', () => {
  expect(replaceTee(tees, 'bottom', 'x')).toEqual({
    top: tees.top,
    right: tees.right,
    bottom: 'x',
    left: tees.left,
  })
})

test('replaceTee.named', () => {
  expect(replaceTee.named('bottom', 'x')('double')).toEqual({
    top: tees.top,
    right: tees.right,
    bottom: 'x',
    left: tees.left,
  })
})

test('replaceBorderLine', () => {
  expect(replaceBorderLine(borders, 'left', 'x').lines.left).toBe('x')
})

test('replaceBorderElbow', () => {
  expect(replaceBorderElbow(borders, 'bottomLeft', 'x').elbows.bottomLeft).toBe(
    'x',
  )
})

test('replaceBorderLine.named', () => {
  expect(replaceBorderLine.named('right', 'thin')(borders).lines.right).toBe(
    '│',
  )
})

test('replaceBorderElbow.named', () => {
  expect(
    replaceBorderElbow.named('topRight', 'ascii')(borders).elbows.topRight,
  ).toBe(elbowSet('ascii').topRight)
})
