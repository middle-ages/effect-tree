import * as fs from 'node:fs'
import {String, pipe} from '#util'
import * as path from 'node:path'
import {Project, type SourceFile} from 'ts-morph'
import {logStart} from './log.js'
import type {LazyArg} from 'effect/Function'

/**
 * Get project main tsconfig path and root folder.
 */
export const initProject = (): {
  project: Project
  home: string
} => {
  const home = root()
  const tsConfigFilePath = path.join(home, 'config', 'tsconfig.main.json')
  const project = new Project({tsConfigFilePath})
  logStart(home, tsConfigFilePath)
  return {project, home}
}

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
 * Get project root folder.
 */
export const root: LazyArg<string> = () =>
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
export const shift = (home: string, source: SourceFile): string =>
  path.join(
    ...path
      .relative(home, path.dirname(source.getFilePath()))
      .split(path.sep)
      .slice(1),
  )

/**
 * Write the lines to the given file.
 */
export const writeLines = (writePath: string, lines: string[]): void => {
  fs.mkdirSync(path.dirname(writePath), {recursive: true})
  fs.writeFileSync(writePath, String.unlines(lines))
}
