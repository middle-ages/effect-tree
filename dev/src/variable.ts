import {Array, Pair, pipe} from '#util'
import {
  VariableDeclarationKind,
  type SourceFile,
  type VariableDeclaration,
  type VariableStatement,
} from 'ts-morph'
import {shift, sourceName} from './fs.js'
import {getExampleSource, isFunctionExample} from './jsDoc.js'
import type {SourceDoc} from './types.js'

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
    const [variableName] = destructVariableDeclaration(statement)
    const sourceFile = statement.getSourceFile()

    return statement.isExported()
      ? pipe(
          statement.getJsDocs(),
          Array.filter(isFunctionExample),
          Array.map(doc => ({
            file: sourceName(sourceFile),
            folder: shift(home, sourceFile),
            exampleSource: getExampleSource(doc),
            variableName,
            doc,
            home,
          })),
        )
      : []
  }

/**
 * Get all const var statements from a source file.
 */
export const getConstVarStatements = (
  source: SourceFile,
): VariableStatement[] =>
  pipe(
    source.getVariableStatements(),
    Array.filter(
      statement =>
        statement.getDeclarationKind() === VariableDeclarationKind.Const,
    ),
  )

/**
 * Get the variable name and the declaration of a variable statement.
 */
const destructVariableDeclaration = (
  statement: VariableStatement,
): readonly [string, VariableDeclaration] =>
  pipe(
    statement.getDeclarations()[0] as VariableDeclaration,
    Pair.square.mapFirst(d => d.getName()),
  )
