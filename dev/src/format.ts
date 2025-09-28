import type {FunctionDeclaration} from 'ts-morph'
import {formatType} from './formatType.js'
import type {Argument, Signature} from './types.js'
import {getSignatures} from './function.js'
import {Array, pipe} from 'effect'

export const formatArgument =
  (home: string) =>
  ({name, type}: Argument): string =>
    `${name}: ${formatType(home)(type)}`

export const formatArgumentList =
  (home: string) =>
  (args: Argument[]): string =>
    args.map(formatArgument(home)).join(', ')

export const formatSignature =
  (home: string) =>
  ({args, returnType}: Signature): string =>
    `(${formatArgumentList(home)(args)}) ⇒ ${formatType(home)(returnType)}`

/**
 * Formats function signatures for all overloads.
 */
export const formatOverloads =
  (home: string) =>
  (fn: FunctionDeclaration): [string, string][] => {
    const name = fn.getName() as string
    return pipe(
      fn,
      getSignatures,
      Array.map(formatSignature(home)),
      Array.map(signature => [name, signature] as [string, string]),
    )
  }
