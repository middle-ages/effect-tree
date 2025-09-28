import type {Array} from '#util'
import {
  type JSDoc,
  type Project as TsProject,
  type Type,
  type TypeChecker,
} from 'ts-morph'

export interface Project {
  /** Absolute path to repo home folder. */
  home: string
  project: TsProject
  tsConfigFile: string
  typeChecker: TypeChecker
}

/**
 * A single JSDoc block for a variable with an `@examples` tag, together with
 * the variable it is annotating and everything we need to write an inline
 * example extracted from source code to disk as a Typescript test file.
 */
export interface SourceDoc {
  /** This example documents a variable or function named so. */
  name: string

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

/** Analyzed signature. */
export interface Signature {
  args: Argument[]
  returnType: Type
}

/** Analyzed argument. */
export interface Argument {
  name: string
  type: Type
}
