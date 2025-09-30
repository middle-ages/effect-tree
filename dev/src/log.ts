import {Function, String} from '#util'
import * as path from 'node:path'
import * as process from 'node:process'
import {type SourceFile} from 'ts-morph'
import type {CounterProgress} from './counters.js'
import type {SourceDoc} from './types.js'

/**
 * Log project init.
 */
export const logStart = (home: string, tsConfigFilePath: string) => {
  console.log(
    `# 📂 Loading tsconfig from “${relativeToHome(home)(tsConfigFilePath)}”.`,
  )
}

/**
 * The source file progress logger.
 */
export type SourceLog = ReturnType<typeof logSource>

/**
 * Log messages for processing a source file.
 */
export const logSource = (home: string, sourceCount: number) => {
  if (sourceCount === 0) {
    throw new Error('No source files found.')
  }
  const relative = relativeToHome(home)
  return {
    init: () => {
      console.log(`#    Loaded ${sourceCount.toString()} main source files.`)
    },

    begin: ({percent, progress}: CounterProgress, source: SourceFile) => {
      const path = relative(source.getFilePath())
      console.log(`# 📄 ${percent}% ${progress}. ${path}`)
    },

    progress: ({percent, progress}: CounterProgress) => {
      process.stdout.clearLine(0)
      process.stdout.write(`# ⏳ ${percent}% ${progress}.`)
      process.stdout.cursorTo(0)
    },

    end: (examples: number, filesWithExamples: number) => {
      console.log('')
      const files = String.pluralNumber('file', filesWithExamples)
      console.log(
        `#\n# ✅ Processed ${examples.toLocaleString()} inline examples found in ${files}.`,
      )
    },
  }
}

/**
 * Log messages for processing a JSDoc example.
 */
export const logSourceExample = (exampleCount: number) => ({
  start: (exampleIndex: number, {name}: SourceDoc) => {
    const index = `${exampleIndex.toString().padStart(3)}/${exampleCount.toString().padStart(3)}`
    console.log(`#         ${index}. ${name}`)
  },
})

function relativeToHome(home: string): Function.EndoOf<string> {
  return to => path.relative(home, to)
}

export const logFindExamples = () => {
  console.log(`# 🔍 Searching for inline examples…\n#`)
}
