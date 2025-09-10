import {describe, expectTypeOf, test} from '@effect/vitest'
import type {Init, Tail, UnionToTuple} from './Tuple.js'

type SomeTuple = readonly ['a', 'b', 'c']

describe('Tuple', () => {
  test('Init', () => {
    expectTypeOf<Init<SomeTuple>>().toEqualTypeOf<readonly ['a', 'b']>()
  })

  test('Tail', () => {
    expectTypeOf<Tail<SomeTuple>>().toEqualTypeOf<readonly ['b', 'c']>()
  })

  test('UnionToTuple', () => {
    expectTypeOf<UnionToTuple<'a' | 'b' | 'c'>>().toEqualTypeOf<SomeTuple>()
  })
})
