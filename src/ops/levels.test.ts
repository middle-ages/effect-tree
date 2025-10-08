import {describe, expect, test} from 'vitest'
import {Prufer} from '#codec'
import {assertDrawNumericTree, assertDrawTree, numericTree} from '#test'
import {branch, from, leaf, map, of, type Tree, type TreeUnfold} from '#tree'
import {Number, pipe} from 'effect'
import fc from 'fast-check'
import {pair} from '#Pair'
import {maximumNodeHeight} from './counts.js'
import {
  addLevelLabels,
  annotateDepth,
  binaryTree,
  cropDepth,
  growLeaves,
  levels,
  unfoldLevelTree,
} from './levels.js'
import {Tree as Arbitrary} from '#arbitrary'

describe('cropDepth', () => {
  test('doc example', () => {
    const depth3: Tree<string> = branch('lvl1', [branch('lvl2', [leaf('vl3')])])

    pipe(
      depth3,
      cropDepth(2),
      assertDrawTree(`
┬lvl1
└─lvl2`),
    )
  })

  test('leaf', () => {
    expect(cropDepth(5)(leaf(1))).toEqual(leaf(1))
  })

  test('∀a ∈ Tree, ∀n ∈ ℕ: maxDepth(a) = n ⇔ a ▹ cropDepth(n) ▹ maxDepth = n', () => {
    const treeAndDepth: fc.Arbitrary<
      readonly [tree: Tree<number>, cropDepth: number]
    > = Arbitrary.getArbitrary(fc.integer({min: 0, max: 5})).chain(tree => {
      return fc.constant(maximumNodeHeight(tree)).map(pair.withFirst(tree))
    })

    fc.assert(
      fc.property(
        treeAndDepth,
        ([a, n]) => n === pipe(a, cropDepth(n), maximumNodeHeight),
      ),
    )
  })
})

describe('levels', () => {
  test('leaf', () => {
    const actual = levels(of(1))
    const expected = [[1]]
    expect(actual).toEqual(expected)
  })

  test('numeric tree', () => {
    const actual = levels(numericTree)
    const expected = [[1], [2, 6, 10], [3, 4, 5, 7, 8, 11], [9]]
    expect(actual).toEqual(expected)
  })
})

describe('annotateDepth', () => {
  test('leaf', () => {
    expect(annotateDepth(leaf('A'))).toEqual(leaf(['A', 1]))
  })

  test('branch', () => {
    expect(annotateDepth(branch('A', [leaf('B')]))).toEqual(
      branch(['A', 1], [leaf(['B', 2])]),
    )
  })

  test('numeric tree', () => {
    expect(annotateDepth(numericTree)).toEqual(
      branch(
        [1, 1],
        [
          branch([2, 2], [of([3, 3]), of([4, 3]), of([5, 3])]),
          branch(
            [6, 2],
            [of([7, 3]), of([8, 3]), branch([11, 3], [of([9, 4])])],
          ),
          of([10, 2]),
        ],
      ),
    )
  })
})

describe('unfoldLevelTree', () => {
  test('basic', () => {
    pipe(
      1,
      unfoldLevelTree({depth: 4}),
      assertDrawNumericTree(`
┬1
└┬2
 └┬3
  └─4`),
    )
  })

  test('degree=depth*2', () => {
    pipe(
      1,
      unfoldLevelTree({depth: 3, degree: Number.multiply(2)}),
      assertDrawNumericTree(`
┬1
├┬2
│├─3
│├─3
│├─3
│└─3
└┬2
 ├─3
 ├─3
 ├─3
 └─3`),
    )
  })
})

describe('levelLabels', () => {
  test('leaf', () => {
    pipe(
      leaf(1),
      map(s => s.toString()),
      addLevelLabels,
      assertDrawTree(`
─1. 1`),
    )
  })

  test('nodeCount≔3', () => {
    pipe(
      Prufer.getNthTree(4n * 10n ** 6n, 13),
      map(s => s.toString()),
      addLevelLabels,
      assertDrawTree(`
┬1. 1
├─1.1. 2
├─1.2. 3
├┬1.3. 4
│└┬1.3.1. 9
│ ├─1.3.1.1. 12
│ └─1.3.1.2. 13
├─1.4. 5
├─1.5. 6
├─1.6. 7
└┬1.7. 11
 ├─1.7.1. 8
 └─1.7.2. 10`),
    )
  })
})

describe('growLeaves', () => {
  const growOneLeaf: TreeUnfold<number, number> = a => branch(a, [leaf(a)])

  test('leaf', () => {
    expect(pipe(42, leaf, growLeaves(growOneLeaf))).toEqual(from(42, leaf(42)))
  })

  test('branch', () => {
    pipe(
      numericTree,
      growLeaves(growOneLeaf),
      assertDrawNumericTree(`
┬1
├┬2
│├┬3
││└─3
│├┬4
││└─4
│└┬5
│ └─5
├┬6
│├┬7
││└─7
│├┬8
││└─8
│└┬11
│ └┬9
│  └─9
└┬10
 └─10`),
    )
  })
})

test('binaryTree', () => {
  assertDrawNumericTree(`
┬1
├┬2
│├┬3
││├─4
││└─4
│└┬3
│ ├─4
│ └─4
└┬2
 ├┬3
 │├─4
 │└─4
 └┬3
  ├─4
  └─4`)(binaryTree(4))
})
