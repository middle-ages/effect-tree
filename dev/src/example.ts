import {Array, String, pipe} from '#util'
import * as path from 'node:path'
import type {SourceFile} from 'ts-morph'
import {getExportedFunctions, getFunctionExamples} from './function.js'
import {addTestImports} from './imports.js'
import {wrapBody} from './insert.js'
import type {SourceDoc} from './types.js'
import {getExportedConsts, getVariableExamples} from './variable.js'

/**
 * Get all `@example` blocks of exported const arrow functions in the variables
 * declared in the given source file.
 */
export const getSourceExamples = (home: string, file: SourceFile) => {
  const variables = pipe(
    file,
    getExportedConsts,
    Array.flatMap(getVariableExamples(home)),
  )
  const functions = pipe(
    file,
    getExportedFunctions,
    Array.flatMap(getFunctionExamples(home)),
  )

  return [...variables, ...functions]
}

/**
 * Write the `@example` comment to a test file.
 */
export const writeExample =
  (inlineExamplesRelative: string | undefined) =>
  ({home, name, folder, exampleSource, file, doc}: SourceDoc) => {
    if (inlineExamplesRelative === undefined || inlineExamplesRelative === '') {
      throw new Error('No path to inline examples.')
    }

    const writePath = path.join(
      home,
      inlineExamplesRelative,
      folder,
      `${file}-${name}.test.ts`,
    )

    const code = pipe(exampleSource, addTestImports, String.unlines)

    const source = doc
      .getProject()
      .createSourceFile(writePath, code, {overwrite: true})

    wrapBody(source, [`test('${file}.${name}', ()  => {`], ['})'])

    source.saveSync()
  }
