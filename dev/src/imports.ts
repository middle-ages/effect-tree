import {Array, pipe} from '#util'
import type {SourceFile} from 'ts-morph'

/**
 * Prefixes source code with test imports.
 */
export const addTestImports = (
  code: Array.NonEmptyArray<string>,
): Array.NonEmptyArray<string> =>
  pipe([`import {test, expect} from 'vitest'`], Array.appendAll(code))

/**
 * Get the insert position following imports.
 */
export const afterImportsPosition = (source: SourceFile) => {
  const lastImportDeclaration = source.getImportDeclarations().at(-1)
  return lastImportDeclaration?.getEnd() ?? 0
}
