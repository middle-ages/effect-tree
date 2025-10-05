import {describe, expect, test} from 'vitest'
import {treeSchema} from './schema.js'
import {Effect, pipe, Schema} from 'effect'
import {numericTree} from '../test.js'

const schema = treeSchema(Schema.Number)
const encode = Schema.encode(schema)
const decode = Schema.decode(schema)

describe('treeSchema', () => {
  describe('encode/decode tree⇔tree', () => {
    test('encode', () => {
      const actual = pipe(numericTree, encode, Effect.runSync)
      expect(actual).toEqual(numericTree)
    })

    test('decode', () => {
      const actual = pipe(numericTree, decode, Effect.runSync)
      expect(actual).toEqual(numericTree)
    })
  })
})
