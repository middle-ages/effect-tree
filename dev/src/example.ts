import {pipe, Array} from '#util'
import type {SourceFile} from 'ts-morph'
import {getExportedConsts, getVariableExamples} from './variable.js'
import {getExportedFunctions, getFunctionExamples} from './function.js'

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
