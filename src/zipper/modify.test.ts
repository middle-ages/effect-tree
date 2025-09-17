import {branch, from, length, of, type Branch} from '#tree'
import {
  append,
  fromTree,
  getFocus,
  getValue,
  head,
  last,
  next,
  prepend,
  remove,
  replace,
  toTree,
  up,
} from '#zipper'
import {flow, Option, pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {assertDrawNumericTree} from '../test.js'

const leaf = of(1)

//──┬─1       ⎞
//  ├───2     ⎬small
//  └───3     ⎠
const small: Branch<number> = branch(1, [of(2), of(3)])

//──┬─1       ⎞
//  ├─┬─2     ⎪
//  │ └─┬───3 ⎬deep
//  │   ├───4 ⎪
//  │   └───5 ⎪
//  ├───6     ⎪
//  └─┬─7     ⎪
//    └───8   ⎠
const deep: Branch<number> = branch(1, [
  from(2, of(3), of(4), of(5)),
  of(6),
  from(7, of(8)),
])

describe('replace', () => {
  test('leaf', () => {
    expect(replace(small)(fromTree(leaf))).toEqual(fromTree(small))
  })

  test('deep', () => {
    pipe(
      deep,
      fromTree,
      head,
      head,
      next,
      replace(of(42)),
      up,
      next,
      replace(of(43)),
      toTree,
      assertDrawNumericTree(`
┬1
├┬2
│├─3
│├─42
│└─5
├─43
└┬7
 └─8`),
    )
  })
})

describe('insert', () => {
  test('leaf', () => {
    expect(replace(small)(fromTree(leaf))).toEqual(fromTree(small))
  })

  test('deep', () => {
    pipe(
      deep,
      fromTree,
      head,
      head,
      next,
      replace(of(42)),
      up,
      next,
      replace(of(43)),
      toTree,
      assertDrawNumericTree(`
┬1
├┬2
│├─3
│├─42
│└─5
├─43
└┬7
 └─8`),
    )
  })
})

test('append', () => {
  expect(pipe(leaf, fromTree, append(of(2)), append(of(3)))).toEqual(
    fromTree(small),
  )
})

test('append.move', () => {
  expect(pipe(leaf, fromTree, append(of(2)), append.move(of(3)))).toEqual(
    pipe(small, fromTree, last),
  )
})

test('prepend', () => {
  expect(pipe(leaf, fromTree, prepend(of(2)), prepend(of(3)))).toEqual(
    fromTree(from(1, of(3), of(2))),
  )
})

test('prepend.move', () => {
  expect(pipe(leaf, fromTree, prepend.move(of(2)))).toEqual(
    pipe(1, branch([of(2)]), fromTree, head),
  )
})

describe('remove', () => {
  test('leaf', () => {
    expect(pipe(leaf, fromTree, remove)).toEqual(Option.none())
  })

  describe('has rights', () => {
    const actual = pipe(small, fromTree, head, remove)

    test('new focus', () => {
      expect(Option.map(actual, getValue)).toEqual(Option.some(3))
    })

    test('old focus removed', () => {
      expect(Option.map(actual, toTree)).toEqual(Option.some(from(1, of(3))))
    })
  })

  describe('no rights', () => {
    //──┬─1
    //  ├─┬─2     ← new focus
    //  │ └─┬───3
    //  │   ├───4
    //  │   └───5 ← focus node removed
    //  ├───6
    //  └─┬─7
    //    └───8
    const actual = pipe(deep, fromTree, head, last, remove)

    test('new focus', () => {
      expect(Option.map(actual, getValue)).toEqual(Option.some(2))
    })

    test('old focus removed', () => {
      expect(Option.map(actual, flow(getFocus, length))).toEqual(Option.some(2))
    })
  })
})
