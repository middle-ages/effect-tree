import {readDirectoryTree, writeDirectoryTree} from '#fileSystem'
import {pluck} from '#Record'
import {assertDrawTree} from '#test'
import {from, getForest, map, of, type Tree} from '#tree'
import {FileSystem, Path} from '@effect/platform'
import {NodeContext} from '@effect/platform-node'
import {describe, it} from '@effect/vitest'
import {Effect} from 'effect'

const dirname = import.meta.dirname

describe('readDirectoryTree', () => {
  it.effect('succeed', () =>
    Effect.gen(function* () {
      const path = yield* Path.Path
      const actual = yield* readDirectoryTree(path.join(dirname, 'fixtures'))
      const names = map(actual, pluck('name'))
      assertDrawTree(`
┬fixtures
└┬directory
 ├─file
 └┬inner-directory
  └─inner-file`)(names)
    }).pipe(Effect.provide(NodeContext.layer)),
  )

  it.effect.fails('fail', () =>
    Effect.gen(function* () {
      yield* readDirectoryTree('some_none_existing_path')
    }).pipe(Effect.provide(NodeContext.layer)),
  )
})

it.scoped('writeDirectoryTree', () =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const tempDir = yield* fs.makeTempDirectoryScoped({prefix: 'test-'})
    const tempTree = from(
      tempDir,
      from(
        'a',
        of('b'),
        from('c', of('d'), of('e')),
        from('f', from('g', of('h'), of('i'))),
      ),
    )

    yield* writeDirectoryTree(tempTree)

    const actual = map(yield* readDirectoryTree(tempDir), pluck('name'))
    const tree = getForest(actual).at(0) as Tree<string>

    assertDrawTree(
      `
┬a
├─b
├┬c
│├─d
│└─e
└┬f
 └┬g
  ├─h
  └─i`,
    )(tree)
  }).pipe(Effect.provide(NodeContext.layer)),
)
