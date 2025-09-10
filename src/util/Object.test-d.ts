import type {FromEntries, InvertedObject, KeyList, ValueList} from './Object.js'
import {describe, expectTypeOf, test} from '@effect/vitest'

interface MyObject {
  readonly one: '1'
  readonly two: '2'
  readonly three: '3'
}

interface Inverted {
  readonly '1': 'one'
  readonly '2': 'two'
  readonly '3': 'three'
}

type Entries = readonly [
  readonly ['one', '1'],
  readonly ['two', '2'],
  readonly ['three', '3'],
]

type Keys = readonly ['one', 'two', 'three']
type Values = readonly ['1', '2', '3']

describe('Object', () => {
  test('KeyList', () => {
    expectTypeOf<KeyList<MyObject>>().toEqualTypeOf<Keys>()
  })

  test('ValueList', () => {
    expectTypeOf<ValueList<MyObject>>().toEqualTypeOf<Values>()
  })

  test('FromEntries', () => {
    expectTypeOf<FromEntries<Entries>>().toEqualTypeOf<MyObject>()
  })

  test('InvertedObject', () => {
    expectTypeOf<InvertedObject<MyObject>>().toEqualTypeOf<Inverted>()
  })
})
