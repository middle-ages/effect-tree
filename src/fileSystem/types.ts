import {FileSystem, type Error, type Path} from '@effect/platform'
import {Effect} from 'effect'

/**
 * @category filesystem
 */
export interface DirectoryEntry {
  /** The basename of this directory entry not including the parent path. */
  name: string

  /** Path to parent directory of this entry. */
  parentPath: string

  /** Type of this directory entry. */
  type: FileSystem.File.Type
}

/**
 * @category unfold
 * @category filesystem
 */
export type DirectoryEffect<A> = Effect.Effect<
  A,
  Error.PlatformError,
  FileSystem.FileSystem | Path.Path
>

/**
 * @internal
 */
export interface HasFileType {
  isFile(): boolean
  isDirectory(): boolean
  isBlockDevice(): boolean
  isCharacterDevice(): boolean
  isSymbolicLink(): boolean
  isFIFO(): boolean
  isSocket(): boolean
}
