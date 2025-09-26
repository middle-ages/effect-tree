import {Array, pipe} from '#util'
import {Project, SourceFile} from 'ts-morph'
import {initProject} from './fs.js'
import {logSource, type SourceLog} from './log.js'
import type {SourceDoc} from './types.js'
import {getConstVarStatements, getVariableExamples} from './variable.js'

/**
 * Information on current source file given to the walker.
 */
export interface WalkInfo {
  file: SourceFile
  home: string
  log: SourceLog
}

/**
 * Traverse the main project source files. These are the library exports and do
 * not include tests, examples, or project dev code.
 */
export const walkSources = <A>(
  f: (source: WalkInfo, a: A) => void,
  onBegin: (main: SourceFile[]) => A,
  onEnd: (log: SourceLog, a: A) => void,
): void => {
  const {project, home} = initProject()
  const main = mainSources(project)
  const log = logSource(home, main.length)

  log.init()
  const a = onBegin(main)

  for (const file of main) {
    f({file, home, log}, a)
  }

  onEnd(log, a)
}

/**
 * Get all `@example` blocks of exported const arrow functions in the variables
 * declared in the given source file.
 */
export const getSourceExamples = (
  home: string,
  file: SourceFile,
): SourceDoc[] =>
  pipe(file, getConstVarStatements, Array.flatMap(getVariableExamples(home)))

/**
 * Get main project source files. These are the library exports and do not
 * include tests, examples, or project dev code.
 */
export function mainSources(project: Project): SourceFile[] {
  return project.getSourceFiles([
    'src/**/*.ts',
    '!src/test/**/*.ts',
    '!src/**/*.test.ts',
    '!src/test.ts',
  ])
}
