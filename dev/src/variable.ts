import {Array, pipe} from '#util'
import {
  VariableDeclarationKind,
  type SourceFile,
  type VariableDeclaration,
  type VariableStatement,
} from 'ts-morph'
import {isFunctionWithExample, sourceDoc} from './jsDoc.js'
import type {SourceDoc} from './types.js'

/**
 * Get all const var statements from a source file.
 */
export const getExportedConsts = (source: SourceFile): VariableStatement[] =>
  pipe(
    source.getVariableStatements(),
    Array.filter(
      statement =>
        statement.getDeclarationKind() === VariableDeclarationKind.Const &&
        statement.isExported(),
    ),
  )

/**
 * Get all JSDoc blocks in variable statement that:
 *
 * 1. Are exported.
 * 1. Are of type _function_.
 * 1. Have an `@example` block.
 */
export const getVariableExamples =
  (home: string) =>
  (statement: VariableStatement): SourceDoc[] => {
    const sourceFile = statement.getSourceFile()
    const declaration = variableDeclaration(statement)
    const build = sourceDoc(home)(declaration.getName(), sourceFile)

    return statement.isExported()
      ? pipe(
          statement.getJsDocs(),
          Array.filter(isFunctionWithExample),
          Array.map(build),
        )
      : []
  }

const variableDeclaration = (
  statement: VariableStatement,
): VariableDeclaration => statement.getDeclarations()[0] as VariableDeclaration
