import {
  fromTree,
  next,
  unsafeNext,
  getRights,
  head,
  previous,
  toTree,
  unsafeHead,
  unsafeLast,
  unsafePrevious,
  unsafeUp,
  up,
  getValue,
  type Zipper,
  type ZipperLevel,
  replace,
  root,
  getLefts,
  append,
  prepend,
} from '#zipper'
import {branch, from, of, type Branch} from '#tree'
import {pairMap, type Pair} from '#util/Pair'
import {Option, pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {assertDrawNumericTree} from '../test.js'

const leaf = of(1)

//──┬─1   ← small
//  ├───2
//  └───3
const small: Branch<number> = branch(1, [of(2), of(3)])

const sub2 = from(2, of(3), of(4), of(5))
//──┬─1       ← deep
//  ├─┬─2
//  │ └─┬───3
//  │   ├───4
//  │   └───5
//  ├───6
//  └─┬─7
//    └───8
const deep: Branch<number> = branch(1, [sub2, of(6), from(7, of(8))])

const rootLevel: ZipperLevel<number> = {
  lefts: [],
  rights: [],
  parent: Option.none(),
}

describe('zipper', () => {
  test('small', () => {
    const {focus, parent} = fromTree(small)
    expect({focus, parent}).toEqual({focus: small, parent: Option.none()})
  })

  describe('head', () => {
    test('leaf', () => {
      expect(head(fromTree(leaf))).toEqual(Option.none())
    })

    test('small', () => {
      expect(pipe(small, fromTree, unsafeHead)).toEqual({
        focus: of(2),
        levels: [rootLevel],
        lefts: [],
        rights: [of(3)],
        parent: Option.some(1),
      })
    })

    const deep2 = pipe(deep, fromTree, unsafeHead, unsafeHead)
    test('deep × 2', () => {
      expect(deep2).toEqual({
        focus: of(3),
        levels: [
          rootLevel,
          {lefts: [], rights: [of(6), from(7, of(8))], parent: Option.some(1)},
        ],
        lefts: [],
        rights: [of(4), of(5)],
        parent: Option.some(2),
      })

      expect(getLefts(deep2), 'lefts').toEqual([])
      expect(getRights(deep2), 'rights').toEqual([of(4), of(5)])
    })
  })

  describe('last', () => {
    test('small', () => {
      const actual = pipe(small, fromTree, unsafeLast)

      expect(actual).toEqual({
        focus: of(3),
        levels: [rootLevel],
        rights: [],
        lefts: [of(2)],
        parent: Option.some(1),
      })
    })
  })

  describe('toTree', () => {
    const [leafZipper, smallZipper, deepZipper] = [
      fromTree(leaf),
      fromTree(small),
      fromTree(deep),
    ]

    test('root', () => {
      expect(toTree(leafZipper)).equals(leaf)
      expect(toTree(smallZipper)).equals(small)
      expect(toTree(deepZipper)).equals(deep)
    })

    const [smallFirst, deepFirst]: Pair<Zipper<number>> = pipe(
      [smallZipper, deepZipper] as const,
      pairMap(unsafeHead),
    )

    test('head', () => {
      expect(toTree(smallFirst), 'small').toEqual(small)
      expect(toTree(deepFirst), 'deep').toEqual(deep)
    })

    const deepFirst2 = unsafeHead(deepFirst)
    test('head × 2', () => {
      expect(toTree(deepFirst2)).toEqual(deep)
    })

    const deepFirstLast = unsafeLast(deepFirst)
    test('head → last', () => {
      expect(toTree(deepFirstLast)).toEqual(deep)
    })
  })

  describe('previous', () => {
    test('leaf', () => {
      expect(pipe(leaf, fromTree, previous)).toEqual(Option.none())
    })

    test('small', () => {
      const actual: number = pipe(
        small,
        fromTree,
        unsafeLast,
        unsafePrevious,
        getValue,
      )

      expect(actual).toBe(2)
    })

    test('deep', () => {
      const actual: number = pipe(
        deep,
        fromTree,
        unsafeHead,
        unsafeLast,
        unsafePrevious,
        unsafePrevious,
        getValue,
      )

      expect(actual).toBe(3)
    })
  })

  describe('next', () => {
    test('leaf', () => {
      expect(pipe(leaf, fromTree, next)).toEqual(Option.none())
    })

    test('deep', () => {
      const actual: number = pipe(
        deep,
        fromTree,
        unsafeHead,
        unsafeNext,
        unsafeNext,
        getValue,
      )

      expect(actual).toBe(7)
    })
  })

  describe('next/previous cancel each other', () => {
    test('previous cancels next', () => {
      const actual: number = pipe(
        deep,
        fromTree,
        unsafeHead,
        unsafeNext,
        unsafeNext,
        unsafePrevious,
        unsafePrevious,
        getValue,
      )
      expect(actual).toBe(2)
    })

    test('next cancels previous', () => {
      const actual: number = pipe(
        deep,
        fromTree,
        unsafeLast,
        unsafePrevious,
        unsafePrevious,
        unsafeNext,
        unsafeNext,
        getValue,
      )
      expect(actual).toBe(7)
    })
  })

  test('root', () => {
    expect(
      pipe(deep, fromTree, unsafeHead, unsafeHead, unsafeNext, root),
    ).toEqual(fromTree(deep))
  })

  describe('up', () => {
    test('leaf', () => {
      expect(pipe(leaf, fromTree, up)).toEqual(Option.none())
    })

    const headOnce = pipe(deep, fromTree, unsafeHead)
    const headTwice = pipe(headOnce, unsafeHead)
    const upOnce = pipe(headTwice, unsafeUp)
    const upTwice = pipe(upOnce, unsafeUp)

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

  describe('replace', () => {
    test('leaf', () => {
      expect(replace(small)(fromTree(leaf))).toEqual(fromTree(small))
    })

    test('deep', () => {
      pipe(
        deep,
        fromTree,
        unsafeHead,
        unsafeHead,
        unsafeNext,
        replace(of(42)),
        unsafeUp,
        unsafeNext,
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
        unsafeHead,
        unsafeHead,
        unsafeNext,
        replace(of(42)),
        unsafeUp,
        unsafeNext,
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

  test('append.unsafeMove', () => {
    expect(
      pipe(leaf, fromTree, append(of(2)), append.unsafeMove(of(3))),
    ).toEqual(pipe(small, fromTree, unsafeLast))
  })

  test('prepend', () => {
    expect(pipe(leaf, fromTree, prepend(of(2)), prepend(of(3)))).toEqual(
      fromTree(from(1, of(3), of(2))),
    )
  })
})
