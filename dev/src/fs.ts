import type {LazyArg} from 'effect/Function'
import * as fs from 'node:fs'
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
 * Assert a source file exists
 */
export const assertExists = (source: SourceFile | undefined): void => {
  if (source === undefined) {
    throw new Error('Missing file')
  } else if (!fs.existsSync(source.getFilePath())) {
    throw new Error(`Missing file: ‘${source.getFilePath()}’`)
  }
}

/**
 * Get project home folder where its `package.json` resides.
 */
export const projectHome: LazyArg<string> = () =>
  path.join(new URL(import.meta.url).pathname, '..', '..', '..')

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
