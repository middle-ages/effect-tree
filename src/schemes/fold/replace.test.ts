import {describe, expect, test} from 'vitest'
import {bracketFold} from '#test'
import {from, of} from '#tree'
import {Effect, flow, pipe} from 'effect'
import {treeCata, treeCataE} from './index.js'
import {replaceEffectFolder, replaceFolder} from './replace.js'

describe('replace', () => {
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
        treeCataE(replaceEffectFolder(flow(bracketFold, Effect.succeed))),
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
})
