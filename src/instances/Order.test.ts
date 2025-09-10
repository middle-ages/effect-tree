import {describe, expect} from 'vitest'
import {getOrder} from './Order.js'
import {test} from '@fast-check/vitest'
import {Number, Order} from '#util'
import {from, leaf, type Tree} from '#tree'
import {numericTree} from '#test'

describe('Order', () => {
  const iut: Order.Order<Tree<number>> = getOrder(Number.Order)

  test('shorter forest comes before longer forest', () => {
    expect(iut(from(1, leaf(2)), from(1, leaf(2), leaf(0)))).toBe(-1)
  })

  test('longer forest comes after shorter forest', () => {
    expect(iut(from(1, leaf(2), leaf(0)), from(1, leaf(2)))).toBe(1)
  })

  test('equality identified', () => {
    expect(iut(numericTree, numericTree)).toBe(0)
  })
})
