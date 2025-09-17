import {assertDrawTree, numericTree} from '#test'
import {map, type Branch} from '#tree'
import {Array, flow, pipe} from 'effect'
import {pairMap} from 'effect-ts-folds'
import {describe, test} from 'vitest'
import {asOrdinal, asOrdinalBranch, withOrdinal} from './ordinal.js'

describe('asOrdinal', () => {
  test('post-order', () => {
    pipe(
      numericTree,
      asOrdinal(1),
      map(n => n.toString()),
      assertDrawTree(`
┬11
├┬4
│├─1
│├─2
│└─3
├┬9
│├─5
│├─6
│└┬8
│ └─7
└─10`),
    )
  })

  test('pre-order', () => {
    pipe(
      numericTree,
      asOrdinal.pre(1),
      map(n => n.toString()),
      assertDrawTree(`
┬1
├┬2
│├─3
│├─4
│└─5
├┬6
│├─7
│├─8
│└┬9
│ └─10
└─11`),
    )
  })
})

describe('asOrdinalBranch', () => {
  test('post-order', () => {
    pipe(
      numericTree as Branch<number>,
      asOrdinalBranch(1),
      map(n => n.toString()),
      assertDrawTree(`
┬11
├┬4
│├─1
│├─2
│└─3
├┬9
│├─5
│├─6
│└┬8
│ └─7
└─10`),
    )
  })

  test('pre-order', () => {
    pipe(
      numericTree as Branch<number>,
      asOrdinalBranch.pre(1),
      map(n => n.toString()),
      assertDrawTree(`
┬1
├┬2
│├─3
│├─4
│└─5
├┬6
│├─7
│├─8
│└┬9
│ └─10
└─11`),
    )
  })
})

describe('withOrdinal', () => {
  test('post-order', () => {
    pipe(
      numericTree,
      withOrdinal(0),
      map(([n, o]) => [n.toString(), o.toString()].join(':')),
      assertDrawTree(`
┬1:10
├┬2:3
│├─3:0
│├─4:1
│└─5:2
├┬6:8
│├─7:4
│├─8:5
│└┬11:7
│ └─9:6
└─10:9`),
    )
  })

  test('pre-order', () => {
    pipe(
      numericTree,
      withOrdinal.pre(0),
      map(
        flow(
          pairMap(n => n.toString()),
          Array.join(':'),
        ),
      ),
      assertDrawTree(`
┬1:0
├┬2:1
│├─3:2
│├─4:3
│└─5:4
├┬6:5
│├─7:6
│├─8:7
│└┬11:8
│ └─9:9
└─10:10`),
    )
  })
})
