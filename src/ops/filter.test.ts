import {numericTree} from '#test'
import {branch, getValue, leaf, of, type Tree} from '#tree'
import {Function, Number, Pair} from '#util'
import {flow, Option, pipe, Predicate} from 'effect'
import {describe, expect, test} from 'vitest'
import {
  filterLeaves,
  filterMinimumLeaf,
  filterNodes,
  includes,
} from './filter.js'

describe('includes', () => {
  const buildIut: (self: Tree<number>) => Predicate.Predicate<number> =
    Function.flipCurried(includes(Number.Equivalence))

  describe('leaf', () => {
    const iut: Predicate.Predicate<number> = pipe(42, leaf, buildIut)

    test('false', () => {
      expect(iut(0)).toBeFalsy()
    })

    test('true', () => {
      expect(iut(42)).toBeTruthy()
    })
  })

  describe('numeric tree', () => {
    const iut: Predicate.Predicate<number> = buildIut(numericTree)

    test('false', () => {
      expect(iut(12)).toBeFalsy()
    })

    test('true', () => {
      expect(iut(11)).toBeTruthy()
    })
  })
})

describe('filterNodes', () => {
  describe('leaf', () => {
    const predicate: Predicate.Predicate<Tree<number>> = flow(
      getValue,
      Number.isPositive,
    )

    test('none', () => {
      const actual = pipe(-1, leaf, filterNodes(predicate))
      expect(actual).toEqual(leaf(-1))
    })

    test('all', () => {
      const actual = pipe(1, leaf, filterNodes(predicate))
      expect(actual).toEqual(leaf(1))
    })
  })

  test('numeric tree', () => {
    const predicate: Predicate.Predicate<Tree<number>> = flow(
      getValue,
      n => n !== 6,
    )

    expect(pipe(numericTree, filterNodes(predicate))).toEqual(
      branch(1, [branch(2, [of(3), of(4), of(5)]), of(10)]),
    )
  })

  test('remove single leaf', () => {
    const predicate: Predicate.Predicate<Tree<number>> = flow(
      getValue,
      (n: number) => n !== 9,
    )
    const actual = pipe(numericTree, filterNodes(predicate))
    const expected: Tree<number> = branch(1, [
      branch(2, [of(3), of(4), of(5)]),
      branch(6, [of(7), of(8), of(11)]),
      of(10),
    ])
    expect(actual).toEqual(expected)
  })
})

describe('filterLeaves', () => {
  describe('leaf', () => {
    test('none', () => {
      const actual = pipe(3, leaf, filterLeaves(Number.isEven))
      expect(actual).toEqual(leaf(3))
    })

    test('all', () => {
      const actual = pipe(2, leaf, filterLeaves(Number.isEven))
      expect(actual).toEqual(leaf(2))
    })
  })

  test('numeric tree', () => {
    expect(pipe(numericTree, filterLeaves(Number.isEven))).toEqual(
      branch(1, [branch(2, [of(4)]), branch(6, [of(8)]), of(10)]),
    )
  })

  test('remove all but a single leaf and its path to root', () => {
    const actual = pipe(
      numericTree,
      filterLeaves((n: number) => n === 3),
    )

    expect(actual).toEqual(branch(1, [branch(2, [of(3)])]))
  })
})

describe('filterMinLeaf', () => {
  const filter = filterMinimumLeaf(Number.Order)

  const checker = () => {
    let step = 1
    return (
      [actualAfter, expectedAfter]: Pair.Pair<Tree<number>>,
      [[actualLeaf, actualParent], [expectedLeaf, expectedParent]]: Pair.Pair<
        [number, Option.Option<number>]
      >,
    ) => {
      describe(`step #${step.toString()}`, () => {
        test('leaf', () => {
          expect(actualLeaf).toBe(expectedLeaf)
        })
        test('parent', () => {
          expect(actualParent).toEqual(expectedParent)
        })
        test('filtered', () => {
          expect(actualAfter).toEqual(expectedAfter)
        })
      })
      step++
    }
  }

  const check = checker()

  /**
    
   STEP          TREE      LEAF  PARENT
   ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
   init       •─┬─5         1      2
                ├─┬─4         
                │ └─┬─2       
                │   └───1     
                └───3         
                              
    1.        •─┬─5         2      4
                ├─┬─4         
                │ └───2       
                └───3         
                              
    2.        •─┬─5         3      5
                ├───4         
                └───3         
                              
    3.        •─┬─5         4      5
                └───4         
                              
    4.        •───5         5      ∅

   */
  const init: Tree<number> = branch(5, [branch(4, [branch(2, [of(1)])]), of(3)])

  const [step1, ...min1] = filter(init)

  check(
    [step1, branch(5, [branch(4, [of(2)]), of(3)])],
    [min1, [1, Option.some(2)]],
  )

  const [step2, ...min2] = filter(step1)
  check([step2, branch(5, [of(4), of(3)])], [min2, [2, Option.some(4)]])

  const [step3, ...min3] = filter(step2)
  check([step3, branch(5, [of(4)])], [min3, [3, Option.some(5)]])

  const [step4, ...min4] = filter(step3)
  check([step4, of(5)], [min4, [4, Option.some(5)]])

  const [step5, ...min5] = filter(step4)
  check([step5, of(5)], [min5, [5, Option.none()]])
})
