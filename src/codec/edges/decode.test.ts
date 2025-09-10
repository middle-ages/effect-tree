import {Edges} from '#codec'
import {describe, expect, test} from 'vitest'
import {from, map, of, type Tree} from '#tree'
import {Pair} from '#util'
import {Array, Option, Tuple, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {assertDrawTree} from '#test'

const edges: NonEmptyArray<Pair.Pair<number>> = [
  [1, 0],
  [2, 1],
  [3, 1],
  [7, 1],
  [4, 3],
  [5, 3],
  [6, 5],
  [8, 7],
]

const actual: Tree<string> = pipe(
  edges,
  Array.map(Tuple.mapSecond(Option.liftPredicate((n: number) => n !== 0))),
  Edges.decode,
  map(n => n.toString()),
)

test('edges decode', () => {
  expect(actual).toEqual(
    from(
      '1',
      of('2'),
      from('3', of('4'), from('5', of('6'))),
      from('7', of('8')),
    ),
  )
})

describe('edges', () => {
  test('decode', () => {
    pipe(
      actual,
      assertDrawTree(`
┬1
├─2
├┬3
│├─4
│└┬5
│ └─6
└┬7
 └─8`),
    )
  })
})
