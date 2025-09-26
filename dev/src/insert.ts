import type {SourceFile} from 'ts-morph'
import {afterImportsPosition} from './imports.js'

/**
 * Prefix/suffix the code following imports with the given lines.
 */
export const wrapBody = (
  source: SourceFile,
  prefix: string[],
  suffix: string[],
) => {
  insertAfterImports(source, prefix)
  appendToSource(source, suffix)
}

/**
 * Insert given lines in the source position.
 */
export const insertLines = (source: SourceFile, pos: number, lines: string[]) =>
  source.insertText(pos, writer => {
    writer.newLine()
    writer.newLine()
    for (const line of lines) {
      writer.writeLine(line)
    }
  })

export const insertAfterImports = (source: SourceFile, lines: string[]) =>
  insertLines(source, afterImportsPosition(source), lines)

export const appendToSource = (source: SourceFile, lines: string[]) =>
  insertLines(source, source.getEnd(), lines)
