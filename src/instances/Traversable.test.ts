import {type Tree, branch, from, of} from '#tree'
import {pipe, Array, flow, Number, String} from '#util'
import {Applicative as ArrayApplicative} from '@effect/typeclass/data/Array'
import {describe, expect, test, it} from '@effect/vitest'
import {traverseEffect, sequence} from './Traversable.js'
import {Effect} from 'effect'
import {assertDrawTree, numericTree} from '#test'

describe('sequence', () => {
  const iut = sequence(ArrayApplicative)
  test('leaf', () => {
    expect(iut(of([1, 2, 3]))).toEqual([of(1), of(2), of(3)])
  })

  test('branch', () => {
    expect(iut(branch([1, 2], [of([4, 5, 6])]))).toEqual([
      from(1, of(4)),
      from(1, of(5)),
      from(1, of(6)),

      from(2, of(4)),
      from(2, of(5)),
      from(2, of(6)),
    ])
  })
})

describe('traverseEffect', () => {
  const increment: (n: number) => Effect.Effect<string[]> = flow(
    Number.increment,
    String.fromNumber,
    Array.of,
    Effect.succeed,
  )

  it.effect('post-order', () =>
    Effect.gen(function* () {
      const [actual]: readonly Tree<string>[] = yield* pipe(
        numericTree,
        traverseEffect.post(ArrayApplicative)(increment),
      )

      assertDrawTree(`
┬2
├┬3
│├─4
│├─5
│└─6
├┬7
│├─8
│├─9
│└┬12
│ └─10
└─11`)(actual as Tree<string>)
    }),
  )
})
