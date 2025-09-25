import {branch, from, getValue as getTreeValue, of, type Branch} from '#tree'
import {isEqual, isNegative} from '#Number'
import {
  at,
  end,
  fromTree,
  getFocus,
  getLefts,
  getRights,
  getValue,
  head,
  headN,
  last,
  lastN,
  next,
  nextN,
  previous,
  previousN,
  repeat,
  repeatUntil,
  repeatUntilValue,
  rewind,
  root,
  toTree,
  tryAt,
  tryDepthFirst,
  tryHead,
  tryHeadN,
  tryLast,
  tryLastN,
  tryNext,
  tryPrevious,
  tryRepeat,
  tryUp,
  up,
  type OptionalZipper,
  type OptionalZipperOf,
  type Zipper,
} from '#zipper'
import {Array, flow, Option, pipe} from 'effect'
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

describe('rewind', () => {
  test('leaf', () => {
    expect(pipe(leaf, fromTree, rewind, getFocus)).toEqual(leaf)
  })

  test('small', () => {
    expect(pipe(small, fromTree, last, rewind, getFocus, getTreeValue)).toEqual(
      2,
    )
  })
})

describe('end', () => {
  test('leaf', () => {
    expect(pipe(leaf, fromTree, end, getFocus)).toEqual(leaf)
  })

  test('deep', () => {
    expect(
      pipe(deep, fromTree, head, head, end, getFocus, getTreeValue),
    ).toEqual(5)
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

describe('depthFirst', () => {
  test('leaf', () => {
    expect(pipe(leaf, fromTree, tryDepthFirst)).toEqual(Option.none())
  })

  test('doc example', () => {
    //
    //                   ┌─┐
    //                   │1│
    //              ╭────┴─┴─────╮
    //            ┌─┴─┐        ┌─┴─┐
    //            │1.1│        │1.2│
    //          ╭─┴───┴╮      ╭┴───┴─╮
    //       ┌──┴──┐┌──┴──┐┌──┴──┐┌──┴──┐
    //       │1.1.1││1.1.2││1.2.1││1.2.2│
    //       └─────┘└─────┘└─────┘└─────┘
    const tree = from(
      '1',
      from('1.1', of('1.1.1'), of('1.1.2')),
      from('1.2', of('1.2.1'), of('1.2.2')),
    )

    const seed = pipe(tree, fromTree, tryDepthFirst)

    const hops = pipe(
      Array.range(1, 6),
      Array.scan(seed, Option.flatMap(tryDepthFirst)),
      Array.map(Option.map(getValue)),
    )

    expect(hops).toEqual([
      Option.some('1.1'),
      Option.some('1.1.1'),
      Option.some('1.1.2'),
      Option.some('1.2'),
      Option.some('1.2.1'),
      Option.some('1.2.2'),
      Option.none(),
    ])
  })
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

describe('repeatUntil', () => {
  describe('found', () => {
    test('leaf', () => {
      expect(
        pipe(
          leaf,
          fromTree,
          repeatUntil(tryHead, flow(getTreeValue, isNegative)),
        ),
      ).toEqual(Option.none())
    })

    test('deep', () => {
      expect(
        pipe(
          deep,
          fromTree,
          repeatUntil(
            flow(tryNext, Option.flatMap(tryHead)),
            flow(getTreeValue, isNegative),
          ),
        ),
      ).toEqual(Option.none())
    })
  })

  describe('found', () => {
    test('leaf', () => {
      expect(
        pipe(
          leaf,
          fromTree,
          repeatUntil(tryHead, flow(getTreeValue, isEqual(1))),
        ),
      ).toEqual(Option.some(fromTree(leaf)))
    })

    test('deep', () => {
      expect(
        pipe(
          deep,
          fromTree,
          repeatUntil(tryHead, flow(getTreeValue, isEqual(3))),
        ),
      ).toEqual(pipe(deep, fromTree, head, head, Option.some))
    })
  })

  describe('repeatUntilValue', () => {
    test('leaf', () => {
      expect(
        pipe(leaf, fromTree, repeatUntilValue(tryNext, isNegative)),
      ).toEqual(Option.none())
    })

    test('get first node of deep', () => {
      expect(
        pipe(
          deep,
          fromTree,
          repeatUntilValue(tryDepthFirst, isEqual(1)),
          Option.map(getValue),
        ),
      ).toEqual(Option.some(1))
    })

    test('get 6th node of deep', () => {
      expect(
        pipe(
          deep,
          fromTree,
          repeatUntilValue(tryDepthFirst, isEqual(6)),
          Option.map(getValue),
        ),
      ).toEqual(Option.some(6))
    })

    test('get last node of deep', () => {
      expect(
        pipe(
          deep,
          fromTree,
          repeatUntilValue(tryDepthFirst, isEqual(8)),
          Option.map(getValue),
        ),
      ).toEqual(Option.some(8))
    })
  })

  test('repeatUntilValue will throw on cyclic navigation', () => {
    // Cyclic navigation.
    const navigate: OptionalZipper = flow(tryNext, Option.flatMap(tryPrevious))

    // Navigation that repeats the cyclic navigation until value=6.
    const go: OptionalZipperOf<number> = repeatUntilValue(navigate, isEqual(6))

    //
    //──┬─1       ⎞                     the cyclic navigation
    //  ├─┬─2     ⎪                     goes back and forth
    //  │ └─┬───3 ⎪ ← zipper focus    ↓ between “3”
    //  │   ├───4 ⎪                   ↑ and “4”
    //  │   └───5 ⎪
    //  ├───6     ⎬deep
    //  └─┬─7     ⎪
    //    └───8   ⎠
    //
    const zipper: Zipper<number> = pipe(deep, fromTree, head, head)

    expect(() => go(zipper)).throws(/Detected cycle in a “repeatUntil”/)
  })

  test('previousN', () => {
    expect(pipe(deep, fromTree, head, last, previousN(2), getValue)).toBe(3)
  })

  test('nextN', () => {
    expect(pipe(deep, fromTree, headN(2), nextN(2), getValue)).toBe(5)
  })
})
