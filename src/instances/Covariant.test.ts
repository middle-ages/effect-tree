import {numericTree} from '#test'
import {branch, of} from '#tree'
import {describe, expect, it, test} from '@effect/vitest'
import {Effect, flow, Number, pipe, type Function} from 'effect'
import {map, mapEffect} from './Covariant.js'

const numericIncremented = branch(2, [
  branch(3, [of(4), of(5), of(6)]),
  branch(7, [of(8), of(9), branch(12, [of(10)])]),
  of(11),
])

describe('Covariant', () => {
  describe('mapEffect', () => {
    const inc = flow(Number.increment, Effect.succeed)

    it.effect('pre-order', () =>
      Effect.gen(function* () {
        expect(yield* pipe(numericTree, mapEffect.pre(inc))).toEqual(
          numericIncremented,
        )
      }),
    )

    it.effect('post-order', () =>
      Effect.gen(function* () {
        expect(yield* pipe(numericTree, mapEffect(inc))).toEqual(
          numericIncremented,
        )
      }),
    )

    describe('mapEffect order', () => {
      const recorder: Function.LazyArg<[number[], typeof inc]> = () => {
        const history: number[] = []
        const f = (n: number): Effect.Effect<number> => {
          history.push(n)
          return inc(n)
        }
        return [history, f]
      }

      /**
       * ```txt
       *
       *     Node       appears in      appears in
       *      ID      Pre-Order at #  Post-Order at #
       * ───────────────────────────────────────────────
       *  •──┬─1           # 1              # 11
       *     ├─┬─2         # 2              # 4
       *     │ ├───3       # 3              # 1
       *     │ ├───4       # 4              # 2
       *     │ └───5       # 5              # 3
       *     ├─┬─6         # 6              # 9
       *     │ ├───7       # 7              # 5
       *     │ ├───8       # 8              # 6
       *     │ └─┬─11      # 9              # 8
       *     │   └───9     # 10             # 7
       *     └───10        # 11             # 10
       * ```
       */
      it.effect('pre-order', () =>
        Effect.gen(function* () {
          const [history, f] = recorder()
          yield* pipe(numericTree, mapEffect.pre(f))
          expect(history).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 11, 9, 10])
        }),
      )

      it.effect('post-order', () =>
        Effect.gen(function* () {
          const [history, f] = recorder()
          yield* pipe(numericTree, mapEffect(f))
          expect(history).toMatchInlineSnapshot([
            3, 4, 5, 2, 7, 8, 9, 11, 6, 10, 1,
          ])
        }),
      )
    })
  })

  describe('map', () => {
    test('post-order', () => {
      const actual = pipe(numericTree, map(Number.increment))
      expect(actual).toEqual(numericIncremented)
    })

    test('post-order', () => {
      const actual = pipe(numericTree, map.pre(Number.increment))
      expect(actual).toEqual(numericIncremented)
    })
  })
})
