import {type Tree, branch, leaf as of} from '#tree'
import {describe, expect, test} from 'vitest'
import {nodeCount} from '#ops'
import {type Equivalence} from 'effect/Equivalence'
import {type LazyArg} from 'effect/Function'
import {numericTree} from '#test'
import {getEquivalence} from './Equivalence.js'

describe('equivalence short-circuits', () => {
  // Return an equivalence to serve as an Implementation Under Test. Besides
  // being an equivalence it will also count calls to the equivalence of the
  // underlying value. This lets us test short-circuiting behavior.
  const record = (): [
    equals: Equivalence<Tree<number>>,
    called: LazyArg<number>,
  ] => {
    let counter = 0
    const numericEquality = (self: number, that: number): boolean => {
      counter++
      return self === that
    }
    return [getEquivalence(numericEquality), () => counter]
  }

  const testShortCircuiting = (
    name: string,
    actual: Tree<number>,
    expected: number,
  ) => {
    describe(name, () => {
      const [equals, called] = record()
      test('≠', () => {
        // numeric tree = •──┬─1
        //                   ├─┬─2
        //                   │ ├───3
        //                   │ ├───4
        //                   │ └───5
        //                   ├─┬─6
        //                   │ ├───7
        //                   │ ├───8
        //                   │ └─┬─11
        //                   │   └───9
        //                   └───10
        expect(equals(numericTree, actual)).toBe(false)
      })

      test(`call count=${expected.toString()}`, () => {
        expect(called()).toBe(expected)
      })
    })
  }

  testShortCircuiting(
    'different root nodes ⇒ called = once',
    branch(999, [branch(2, [of(3)])]),
    1,
  )

  testShortCircuiting(
    'first child node different forest length ⇒ called = once',
    branch(1, [branch(999, [of(3), of(4), of(5)]), branch(6, [of(7)])]),
    1,
  )

  testShortCircuiting(
    'first child node same forest length ⇒ called = twice',
    branch(1, [branch(999, [of(3), of(4), of(5)]), branch(6, [of(7)]), of(10)]),
    2,
  )

  testShortCircuiting(
    'second child node ⇒ called = root + first subtree + second child node',
    branch(1, [
      branch(2, [of(3), of(4), of(5)]),
      branch(999, [of(7), of(8), branch(11, [of(9)])]),
      of(10),
    ]),
    1 + 4 + 1,
  )

  testShortCircuiting(
    'first child of first child node ⇒ called = root + first child + first grandchild',
    branch(1, [
      branch(2, [of(999), of(4), of(5)]),
      branch(6, [of(7), of(8), branch(11, [of(9)])]),
      of(10),
    ]),
    1 + 1 + 1,
  )

  testShortCircuiting(
    'last child of first child node ⇒ called = root + first subtree',
    branch(1, [
      branch(2, [of(3), of(4), of(999)]),
      branch(6, [of(7), of(8), branch(11, [of(9)])]),
      of(10),
    ]),
    1 + 4,
  )

  testShortCircuiting(
    'worst case: last child node ⇒ called = node count',
    branch(1, [
      branch(2, [of(3), of(4), of(5)]),
      branch(6, [of(7), of(8), branch(11, [of(9)])]),
      of(999),
    ]),
    nodeCount(numericTree),
  )
})
