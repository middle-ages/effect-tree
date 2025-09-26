import type {Array} from '#util'
import {type JSDoc} from 'ts-morph'

/**
 * A single JSDoc block for a variable with an `@examples` tag, together with
 * the variable it is annotating and everything we need to write an inline
 * example extracted from source code to disk as a Typescript source file.
 */
export interface SourceDoc {
  /** This example documents a variable named so. */
  variableName: string

  /** Lines of example source code. */
  exampleSource: Array.NonEmptyArray<string>

  /** Absolute path of project home folder where package.json lives. */
  home: string

  /** Basename of file where this example is found with no extension. */
  file: string

  /**
   * Relative path from project root source folder (`src/`) to folder of the
   * file where the statement with this example is found.
   */
  folder: string

  /** Where is this example? In this JSDoc block. */
  doc: JSDoc
}
