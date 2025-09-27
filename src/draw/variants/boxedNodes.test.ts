import {from, of} from '#tree'
import {Function, pipe} from '#util'
import {expect, test} from 'vitest'
import {getTheme, themedTree} from '../tree.js'
import {setBoxNodesFormatter} from './boxedNodes.js'

// ┬root
// ├┬branch₁
// │├─leaf₁₁
// │├─leaf₁₂
// │└┬branch₁₃
// │ └─leaf₁₃₁
// ├─branch₂
// ├─leaf₂₁
// └─leaf₂₂
const tree = from(
  'root',
  from('branch₁', of('leaf₁₁'), of('leaf₁₂'), from('branch₁₃', of('leaf₁₃₁'))),
  from('branch₂'),
  of('leaf₂₁'),
  of('leaf₂₂'),
)

test('basic', () => {
  const actual = pipe(
    'thin',
    getTheme,
    setBoxNodesFormatter,
    themedTree,
    Function.apply(tree),
  )

  expect(actual).toEqual([
    '┬┬────┐                  ',
    '││root│                  ',
    '│└────┘                  ',
    '├────┬┬───────┐          ',
    '│    ││branch₁│          ',
    '│    │└───────┘          ',
    '│    ├─────┬──────┐      ',
    '│    │     │leaf₁₁│      ',
    '│    │     └──────┘      ',
    '│    ├─────┬──────┐      ',
    '│    │     │leaf₁₂│      ',
    '│    │     └──────┘      ',
    '│    └────┬┬────────┐    ',
    '│         ││branch₁₃│    ',
    '│         │└────────┘    ',
    '│         └─────┬───────┐',
    '│               │leaf₁₃₁│',
    '│               └───────┘',
    '├─────┬───────┐          ',
    '│     │branch₂│          ',
    '│     └───────┘          ',
    '├─────┬──────┐           ',
    '│     │leaf₂₁│           ',
    '│     └──────┘           ',
    '└─────┬──────┐           ',
    '      │leaf₂₂│           ',
    '      └──────┘           ',
  ])
})
