import {branch, from, of, type Branch} from '#tree'
import {pairMap, type Pair} from '#Pair'
import {fromTree, toTree, head, last, type Zipper} from '#zipper'
import {pipe} from 'effect'
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

describe('toTree', () => {
  const [leafZipper, smallZipper, deepZipper] = [
    fromTree(leaf),
    fromTree(small),
    fromTree(deep),
  ]

  test('root', () => {
    expect(toTree(leafZipper)).toEqual(leaf)
    expect(toTree(smallZipper)).toEqual(small)
    expect(toTree(deepZipper)).toEqual(deep)
  })

  const [smallFirst, deepFirst]: Pair<Zipper<number>> = pipe(
    [smallZipper, deepZipper] as const,
    pairMap(head),
  )

  test('head', () => {
    expect(toTree(smallFirst), 'small').toEqual(small)
    expect(toTree(deepFirst), 'deep').toEqual(deep)
  })

  const deepFirst2 = head(deepFirst)
  test('head × 2', () => {
    expect(toTree(deepFirst2)).toEqual(deep)
  })

  const deepFirstLast = last(deepFirst)
  test('head → last', () => {
    expect(toTree(deepFirstLast)).toEqual(deep)
  })
})
