import {bracketFold} from '#test'
import {annotateEffectFolder, annotateFolder, from, of} from '#tree'
import {Effect, flow, pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {treeCata, treeCataEffect} from './index.js'

describe('annotate', () => {
  // tree = ┬A ⇒ A(B,C(D,E),F)
  //        ├─B
  //        ├┬C
  //        │├─D
  //        │└─E
  //        └─F
  //
  const tree = from('A', of('B'), from('C', of('D'), of('E')), of('F'))

  test('annotateFolder', () => {
    expect(pipe(tree, treeCata(annotateFolder(bracketFold)))).toEqual(
      from(
        ['A', 'A(B, C(D, E), F)'],
        of(['B', 'B']),
        from(['C', 'C(D, E)'], of(['D', 'D']), of(['E', 'E'])),
        of(['F', 'F']),
      ),
    )
  })

  test('annotateEffectFolder', () => {
    expect(
      pipe(
        tree,
        treeCataEffect(annotateEffectFolder(flow(bracketFold, Effect.succeed))),
        Effect.runSync,
      ),
    ).toEqual(
      from(
        ['A', 'A(B, C(D, E), F)'],
        of(['B', 'B']),
        from(['C', 'C(D, E)'], of(['D', 'D']), of(['E', 'E'])),
        of(['F', 'F']),
      ),
    )
  })
})
