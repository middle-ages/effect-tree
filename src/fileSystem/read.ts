import {
  unfoldEffect,
  type ParentEffectUnfolder,
  type Tree,
  type TreeEffectUnfold,
} from '#tree'
import {FileSystem, Path, type Error} from '@effect/platform'
import {Array, Effect, pipe} from 'effect'
import * as NFS from 'node:fs'
import {handleErrnoException} from './error.js'
import type {DirectoryEffect, DirectoryEntry, HasFileType} from './types.js'

/**
 * @example
 * import {drawTree, map, FileSystem} from 'effect-tree'
 * import {Effect, pipe} from 'effect'
 * import {NodeContext, NodeRuntime} from '@effect/platform-node'
 * import {Path} from '@effect/platform'
 *
 * const effect = Effect.gen(function* () {
 *   const path = yield* Path.Path
 *
 *   // Goto src/fileSystem/fixtures
 *   const directory = path.join(
 *     import.meta.dirname,
 *     '..',
 *     '..',
 *     '..',
 *     'src',
 *     'fileSystem',
 *     'fixtures',
 *   )
 *
 *   const tree = yield* FileSystem.readDirectoryTree(directory)
 *
 *   const mapped = map(tree, ({name}) => name)
 *   const drawn = drawTree(mapped)
 *   expect(drawn).toEqual([
 *     '┬fixtures         ',
 *     '└┬directory       ',
 *     ' ├─file           ',
 *     ' └┬inner-directory',
 *     '  └─inner-file    '
 *   ])
 * })
 *
 * pipe(effect, Effect.provide(NodeContext.layer), NodeRuntime.runMain)
 * @category filesystem
 * @function
 */
export const readDirectoryTree = (
  directoryPath: string,
): DirectoryEffect<Tree<DirectoryEntry>> =>
  Effect.gen(function* () {
    const path = yield* Path.Path
    return yield* readDirectoryTreeEntries({
      name: path.basename(directoryPath),
      parentPath: path.dirname(directoryPath),
      type: 'Directory',
    })
  })

/**
 * A function of the type:
 *
 * ```ts
 * (entry: DirectoryEntry) => Effect.Effect<
 *   Tree<DirectoryEntry>,
 *   Error.PlatformError,
 *   FileSystem.FileSystem
 * >
 * ```
 *
 * @category filesystem
 * @function
 */
export const readDirectoryTreeEntries: TreeEffectUnfold<
  DirectoryEntry,
  DirectoryEntry,
  Error.PlatformError,
  FileSystem.FileSystem | Path.Path
> = entry => unfoldEffect(readDirectoryParentUnfolder)(entry)

const readDirectoryParentUnfolder: ParentEffectUnfolder<
  DirectoryEntry,
  Error.PlatformError,
  FileSystem.FileSystem | Path.Path
> = entry =>
  Effect.gen(function* () {
    const path = yield* Path.Path
    const {name, parentPath, type} = entry
    yield* FileSystem.FileSystem
    return type === 'Directory'
      ? yield* pipe(path.join(parentPath, name), readDirectoryEntries)
      : []
  })

const readDirectoryEntries = (
  path: string,
): DirectoryEffect<DirectoryEntry[]> =>
  pipe(
    Effect.tryPromise({
      try: () => NFS.promises.readdir(path, {withFileTypes: true}),
      catch: err =>
        handleErrnoException('FileSystem', 'readDirectoryEntry')(
          err as NodeJS.ErrnoException,
          [path],
        ),
    }),
    Effect.map(
      Array.map(
        (entry): DirectoryEntry => ({
          name: entry.name,
          parentPath: entry.parentPath,
          type: makeFileType(entry),
        }),
      ),
    ),
  )

/* v8 ignore next 15 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const makeFileType = (stat: HasFileType): FileSystem.File.Type =>
  stat.isFile()
    ? 'File'
    : stat.isDirectory()
      ? 'Directory'
      : stat.isSymbolicLink()
        ? 'SymbolicLink'
        : stat.isSocket()
          ? 'Socket'
          : stat.isBlockDevice()
            ? 'BlockDevice'
            : stat.isCharacterDevice()
              ? 'CharacterDevice'
              : 'FIFO'
