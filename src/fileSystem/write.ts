import {Paths} from '#codec'
import {type Tree} from '#tree'
import {FileSystem, Path} from '@effect/platform'
import {Effect} from 'effect'
import type {DirectoryEffect} from './types.js'

/**
 * @category filesystem
 * @function
 */
export const writeDirectoryTree = (
  self: Tree<string>,
  mode?: number,
): DirectoryEffect<void> =>
  Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    for (const p of Paths.encode(self)) {
      yield* fs.makeDirectory(path.join(...p), {
        /* v8 ignore next 1 */
        ...(mode !== undefined && {mode}),
        recursive: true,
      })
    }
  })
