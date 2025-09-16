import {branch, from, of, type Branch} from '#tree'
import {
  at,
  fromTree,
  tryLastN,
  lastN,
  getFocus,
  getLefts,
  getRights,
  getValue,
  head,
  headN,
  last,
  next,
  previous,
  root,
  toTree,
  tryAt,
  tryHead,
  tryHeadN,
  tryLast,
  tryNext,
  tryPrevious,
  tryUp,
  up,
  tryRepeat,
  repeat,
} from '#zipper'
import {flow, Option, pipe} from 'effect'
import {describe, expect, test} from 'vitest'

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

describe('navigate', () => {
  describe('head', () => {
    test('leaf', () => {
      expect(tryHead(fromTree(leaf))).toEqual(Option.none())
    })

    test('small', () => {
      expect(pipe(small, fromTree, head, getFocus)).toEqual(of(2))
    })

    const deep2 = pipe(deep, fromTree, head, head)
    test('deep × 2', () => {
      expect(getFocus(deep2)).toEqual(of(3))
      expect(getLefts(deep2), 'lefts').toEqual([])
      expect(getRights(deep2), 'rights').toEqual([of(4), of(5)])
    })
  })

  describe('headN', () => {
    test('leaf', () => {
      expect(tryHeadN(fromTree(leaf), 3)).toEqual(Option.none())
    })

    test('small', () => {
      expect(pipe(small, fromTree, headN(1), getFocus)).toEqual(of(2))
    })
  })

  describe('lastN', () => {
    test('leaf', () => {
      expect(tryLastN(fromTree(leaf), 3)).toEqual(Option.none())
    })

    test('deep', () => {
      expect(pipe(deep, fromTree, lastN(2), getFocus)).toEqual(of(8))
    })
  })

  describe('at', () => {
    test('leaf', () => {
      expect(tryHead(fromTree(leaf))).toEqual(Option.none())
    })

    test('small', () => {
      expect(pipe(small, fromTree, at(1), getFocus)).toEqual(of(3))
    })

    test('negative index', () => {
      expect(pipe(small, fromTree, at(-2), getFocus)).toEqual(of(2))
    })

    test('out-of-bounds index', () => {
      expect(pipe(small, fromTree, tryAt(2))).toEqual(Option.none())
    })
  })

  describe('repeat', () => {
    test('leaf', () => {
      expect(tryRepeat(fromTree(leaf), 3, tryHead)).toEqual(Option.none())
    })

    test('deep', () => {
      expect(
        pipe(
          deep,
          fromTree,
          repeat(1, flow(tryHead, Option.flatMap(tryNext))),
          getFocus,
        ),
      ).toEqual(of(6))
    })
  })

  describe('last', () => {
    test('leaf', () => {
      expect(tryLast(fromTree(leaf))).toEqual(Option.none())
    })

    test('small', () => {
      expect(pipe(small, fromTree, last, getFocus)).toEqual(of(3))
    })
  })

  describe('previous', () => {
    test('leaf', () => {
      expect(pipe(leaf, fromTree, tryPrevious)).toEqual(Option.none())
    })

    test('small', () => {
      expect(pipe(small, fromTree, last, previous, getValue)).toBe(2)
    })

    test('deep', () => {
      const actual: number = pipe(
        deep,
        fromTree,
        head,
        last,
        previous,
        previous,
        getValue,
      )

      expect(actual).toBe(3)
    })
  })

  describe('next', () => {
    test('leaf', () => {
      expect(pipe(leaf, fromTree, tryNext)).toEqual(Option.none())
    })

    test('deep', () => {
      const actual: number = pipe(deep, fromTree, head, next, next, getValue)

      expect(actual).toBe(7)
    })
  })

  describe('next/previous cancel each other', () => {
    test('previous cancels next', () => {
      const actual: number = pipe(
        deep,
        fromTree,
        head,
        next,
        next,
        previous,
        previous,
        getValue,
      )
      expect(actual).toBe(2)
    })

    test('next cancels previous', () => {
      const actual: number = pipe(
        deep,
        fromTree,
        last,
        previous,
        previous,
        next,
        next,
        getValue,
      )
      expect(actual).toBe(7)
    })
  })

  test('root', () => {
    expect(pipe(deep, fromTree, head, head, next, root)).toEqual(fromTree(deep))
  })

  describe('up', () => {
    test('leaf', () => {
      expect(pipe(leaf, fromTree, tryUp)).toEqual(Option.none())
    })

    const headOnce = pipe(deep, fromTree, head)
    const headTwice = pipe(headOnce, head)
    const upOnce = pipe(headTwice, up)
    const upTwice = pipe(upOnce, up)

    test('up one', () => {
      expect(upOnce).toEqual(headOnce)
    })

    test('up twice', () => {
      expect(upTwice).toEqual(fromTree(deep))
    })

    describe('tree rebuilt', () => {
      test('up once', () => {
        expect(toTree(upOnce)).toEqual(deep)
      })
      test('up twice', () => {
        expect(toTree(upTwice)).toEqual(deep)
      })
    })
  })
})
