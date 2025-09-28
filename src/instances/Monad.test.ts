import {drawTree} from '#draw'
import {numericTree} from '#test'
import {of, type Tree} from '#tree'
import {Array} from '#util'
import {describe, expect, it, test} from '@effect/vitest'
import {Effect, Number, pipe, type Function} from 'effect'
import {flatMapEffect} from './Monad.js'

const incremented = `┬2....
├┬3...
│├─4..
│├─5..
│└─6..
├┬7...
│├─8..
│├─9..
│└┬12.
│.└─10
└─11..`.split('\n')

interface IncEffect {
  (n: number): Effect.Effect<Tree<number>>
}

const inc: Function.LazyArg<[number[], IncEffect]> = () => {
  const history: number[] = []
  const f = (n: number) => {
    history.push(n)
    return pipe(n, Number.increment, of, Effect.succeed)
  }
  return [history, f]
}

describe('order', () => {
  test('post-order', () => {
    const [history, f] = inc()
    pipe(numericTree, flatMapEffect(f), Effect.runSync)
    expect(history, 'history').toEqual([3, 4, 5, 2, 7, 8, 9, 11, 6, 10, 1])
  })

  test('pre-order', () => {
    const [history, f] = inc()
    pipe(numericTree, flatMapEffect.pre(f), Effect.runSync)
    expect(history, 'history').toEqual([1, 2, 3, 4, 5, 6, 7, 8, 11, 9, 10])
  })
})

describe('drawTree', () => {
  it.effect('pre-order', () =>
    Effect.gen(function* () {
      const [, f] = inc()
      const tree = yield* pipe(numericTree, flatMapEffect.pre(f))
      const actual = Array.map(drawTree.number(tree), line =>
        line.replaceAll(' ', '.'),
      )
      expect(actual).toEqual(incremented)
    }),
  )

  it.effect('post-order', () =>
    Effect.gen(function* () {
      const [, f] = inc()
      const tree = yield* pipe(numericTree, flatMapEffect(f))
      const actual = Array.map(drawTree.number(tree), line =>
        line.replaceAll(' ', '.'),
      )
      expect(actual).toEqual(incremented)
    }),
  )
})
