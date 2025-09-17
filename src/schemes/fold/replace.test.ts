import {bracketFold} from '#test'
import {from, of} from '#tree'
import {Effect, flow, pipe} from 'effect'
import {expect, test} from 'vitest'
import {treeCata, treeCataEffect} from './index.js'
import {replaceEffectFolder, replaceFolder} from './replace.js'

// tree = ┬A ⇒ A(B,C(D,E),F)
//        ├─B
//        ├┬C
//        │├─D
//        │└─E
//        └─F
//
const tree = from('A', of('B'), from('C', of('D'), of('E')), of('F'))

test('replaceFolder', () => {
  expect(pipe(tree, treeCata(replaceFolder(bracketFold)))).toEqual(
    from(
      'A(B, C(D, E), F)',
      of('B'),
      from('C(D, E)', of('D'), of('E')),
      of('F'),
    ),
  )
})

test('replaceEffectFolder', () => {
  expect(
    pipe(
      tree,
      treeCataEffect(replaceEffectFolder(flow(bracketFold, Effect.succeed))),
      Effect.runSync,
    ),
  ).toEqual(
    from(
      'A(B, C(D, E), F)',
      of('B'),
      from('C(D, E)', of('D'), of('E')),
      of('F'),
    ),
  )
})
