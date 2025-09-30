import {SourceFile} from 'ts-morph'
import {logSource, type SourceLog} from './log.js'
import {type Project} from './types.js'

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
export const walkSources =
  (project: Project, targetPath?: string) =>
  <A>(
    f: (source: WalkInfo, a: A) => void,
    onBegin: (main: SourceFile[]) => A,
    onEnd: (log: SourceLog, a: A) => void,
  ): void => {
    const {home} = project
    const main =
      targetPath === undefined || targetPath === ''
        ? mainSources(project)
        : ([project.project.getSourceFile(targetPath)] as [SourceFile])
    const log = logSource(home, main.length)

    log.init()
    const a = onBegin(main)

    for (const file of main) {
      f({file, home, log}, a)
    }

    onEnd(log, a)
  }

/**
 * Get main project source files. These are the library exports and do not
 * include tests, examples, or project dev code.
 */
export function mainSources({project}: Project): SourceFile[] {
  return project.getSourceFiles([
    'src/**/*.ts',
    '!src/util/**/*.ts',
    '!src/test/**/*.ts',
    '!src/**/*.test.ts',
    '!src/test.ts',
  ])
}
