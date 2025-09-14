import {
  fromTree,
  head,
  previous,
  toTree,
  unsafeHead,
  unsafeLast,
  unsafePrevious,
  unsafeUp,
  up,
  value,
  type Zipper,
  type ZipperLevel,
} from '#ops/zipper'
import {branch, from, of, type Branch} from '#tree'
import {pairMap, type Pair} from '#util/Pair'
import {Option, pipe} from 'effect'
import {describe, expect, test} from 'vitest'

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

    test('deep × 2', () => {
      expect(pipe(deep, fromTree, unsafeHead, unsafeHead)).toEqual({
        focus: of(3),
        levels: [
          rootLevel,
          {lefts: [], rights: [of(6), from(7, of(8))], parent: Option.some(1)},
        ],
        lefts: [],
        rights: [of(4), of(5)],
        parent: Option.some(2),
      })
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

    test('deep', () => {
      const actual: number = pipe(
        small,
        fromTree,
        unsafeLast,
        unsafePrevious,
        value,
      )

      expect(actual).toBe(2)
    })
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
})
