import {
  IndentationText,
  NewLineKind,
  Project as TsProject,
  QuoteKind,
} from 'ts-morph'
import {projectHome, tsconfig} from './fs.js'
import {logStart} from './log.js'
import type {Project} from './types.js'

/**
 * Get project main tsconfig path and root folder.
 */
export const initProject = (): Project => {
  const home = projectHome()
  const tsConfigFile = tsconfig(home)
  const project = buildProject(tsConfigFile)

  logStart(home, tsConfigFile)
  return {tsConfigFile, project, home, typeChecker: project.getTypeChecker()}
}

function buildProject(tsConfigFilePath: string): TsProject {
  return new TsProject({
    tsConfigFilePath,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      newLineKind: NewLineKind.LineFeed,
      quoteKind: QuoteKind.Single,
      usePrefixAndSuffixTextForRename: true,
      useTrailingCommas: true,
    },
  })
}
