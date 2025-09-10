import {describe, expect, test} from 'vitest'
import {pipe, Array, Boolean} from 'effect'
import {Prufer} from '#codec'
import {type Tree, map} from '#tree'
import {drawTree} from '#draw'

export const assertRectangular = (self: Tree<number>) => {
  const lines = pipe(
    self,
    map(s => s.toString()),
    drawTree,
  )

  const [head, ...rest] = lines
  expect(head).toBeDefined()

  const lineCountEqual = pipe(
    rest,
    Array.map(xs => xs.length === head.length),
    Boolean.every,
  )

  expect(lineCountEqual).toBeTruthy()
}

describe('part invariants', () => {
  test('All trees where nodeCount≔5', () => {
    for (const tree of Prufer.allTreesAt(5)) assertRectangular(tree)
  })
})
