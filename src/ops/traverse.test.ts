import {describe, expect, test} from 'vitest'
import {branch, leaf} from '#tree'
import {numericTree} from '#test'
import {
  postOrderValues,
  preOrderValues,
  breadthOrderValues,
  allLeaves,
} from './traverse.js'

const myTree = branch(1, [branch(2, [branch(3, [leaf(4)])]), leaf(5)])

describe('preOrderValues', () => {
  test('doc example', () => {
    expect(preOrderValues(myTree)).toEqual([1, 2, 3, 4, 5])
  })

  test('leaf', () => {
    expect(preOrderValues(leaf(1))).toEqual([1])
  })

  test('numericTree', () => {
    expect(preOrderValues(numericTree)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 11, 9, 10,
    ])
  })
})

describe('postOrderValues', () => {
  test('doc example', () => {
    expect(postOrderValues(myTree)).toEqual([4, 3, 2, 5, 1])
  })

  test('leaf', () => {
    expect(postOrderValues(leaf(1))).toEqual([1])
  })

  test('numericTree', () => {
    expect(postOrderValues(numericTree)).toEqual([
      3, 4, 5, 2, 7, 8, 9, 11, 6, 10, 1,
    ])
  })
})

describe('breadthOrderValues', () => {
  test('leaf', () => {
    expect(breadthOrderValues(leaf(1))).toEqual([1])
  })

  test('numericTree', () => {
    expect(breadthOrderValues(numericTree)).toEqual([
      1, 2, 6, 10, 3, 4, 5, 7, 8, 11, 9,
    ])
  })
})

describe('allLeaves', () => {
  test('leaf', () => {
    expect(allLeaves(leaf(1))).toEqual([1])
  })

  test('branch', () => {
    expect(allLeaves(myTree)).toEqual([4, 5])
  })

  test('numeric tree', () => {
    //
    // •──┬─1
    //    ├─┬─2
    //    │ ├───3
    //    │ ├───4
    //    │ └───5
    //    ├─┬─6
    //    │ ├───7
    //    │ ├───8
    //    │ └─┬─11
    //    │   └───9
    //    └───10
    //
    expect(allLeaves(numericTree)).toEqual([3, 4, 5, 7, 8, 9, 10])
  })
})
