import {Array, pipe} from '#util'
import {
  Signature as TsSignature,
  type FunctionDeclaration,
  type Node,
  type SourceFile,
} from 'ts-morph'
import {hasExample, sourceDoc} from './jsDoc.js'
import type {Signature, SourceDoc} from './types.js'

/**
 * Get all functions from a source file that have a name and are exported.
 */
export const getExportedFunctions = (
  source: SourceFile,
): FunctionDeclaration[] =>
  pipe(
    source.getFunctions(),
    Array.filter(
      declaration =>
        declaration.isNamedExport() && declaration.getSymbol() !== undefined,
    ),
  )

/**
 * Get all JSDoc blocks in a function declaration that have an `@example` block.
 */
export const getFunctionExamples =
  (home: string) =>
  (declaration: FunctionDeclaration): SourceDoc[] => {
    const sourceFile = declaration.getSourceFile()
    const name = declaration.getName()

    if (name === undefined) {
      return []
    }

    const build = sourceDoc(home)(name, sourceFile)
    return pipe(
      declaration.getJsDocs(),
      Array.filter(hasExample),
      Array.map(build),
    )
  }

/**
 * Extract function signatures from all overloads.
 */
export const getSignatures = (fn: FunctionDeclaration): Signature[] =>
  pipe(
    fn.getOverloads(),
    Array.match({
      onEmpty: () => [buildSignature(fn)],
      onNonEmpty: Array.map(buildSignature),
    }),
  )

export const buildSignature = (fn: FunctionDeclaration): Signature =>
  fromSignature(fn)(fn.getSignature())

export function fromSignature(node: Node) {
  return (sig: TsSignature): Signature => ({
    args: sig.getParameters().map(param => ({
      name: param.getName(),
      type: param.getTypeAtLocation(node),
    })),
    returnType: sig.getReturnType(),
  })
}
