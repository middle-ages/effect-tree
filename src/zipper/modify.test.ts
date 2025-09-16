import {branch, from, of, type Branch} from '#tree'
import {
  append,
  fromTree,
  prepend,
  replace,
  toTree,
  head,
  last,
  next,
  up,
} from '#zipper'
import {pipe} from 'effect'
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

describe('modify', () => {
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
})
