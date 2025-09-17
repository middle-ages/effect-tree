import {Prufer} from '#codec'
import {drawTree} from '#draw'
import {type Tree, map} from '#tree'
import {Array, Boolean, pipe} from 'effect'
import {expect, test} from 'vitest'

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

test('All trees where nodeCount≔5', () => {
  for (const tree of Prufer.allTreesAt(5)) assertRectangular(tree)
})
