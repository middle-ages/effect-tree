import {pipe} from '#util'
import type {LazyArg} from 'effect/Function'
import * as path from 'node:path'
import {type SourceFile} from 'ts-morph'

/**
 * Get project main tsconfig path.
 */
export function tsconfig(home: string): string {
  return path.join(home, 'config', 'tsconfig.main.json')
}

/**
 * Get a source file basename with no extension.
 */
export const sourceName = (source: SourceFile): string =>
  path.basename(source.getFilePath()).replace(/\.ts$/, '')

/**
 * Get project home folder where its `package.json` resides.
 */
export const projectHome: LazyArg<string> = () =>
  pipe(
    new URL(import.meta.url).pathname,
    path.dirname,
    path.dirname,
    path.dirname,
  )

/**
 * Cuts off both sides: the file and the relative root path, of the
 * given source file path.
 *
 * For example:
 *
 * ```ts
 * const sourceFile = ... some source file with getFilePath
 *                        returning /home/foo/bar/baz/bam.ts
 * const shifted = shift('/home/foo', sourceFile)
 * // shifted = “baz”
 * //
 * // top segment (bar) and file part (bam.ts) have been
 * // chopped off.
 *
 * ```
 */
export const shiftPath = (home: string, source: SourceFile): string =>
  path.join(
    ...path
      .relative(home, path.dirname(source.getFilePath()))
      .split(path.sep)
      .slice(1),
  )
