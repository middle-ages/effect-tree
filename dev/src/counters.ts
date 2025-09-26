/**
 * Counter data for progress when extracting inline examples.
 */
export interface ExampleCountersData {
  totalFiles: number
  files: number
  examples: number
  filesWithExamples: number
}

/**
 * Counter for progress when extracting inline examples.
 */
export interface ExampleCounters {
  readFile: () => void
  readExample: () => void
  foundExampleInFile: () => void
  get: () => ExampleCountersData
  progress: () => CounterProgress
}

/**
 * Counter progress.
 */
export interface CounterProgress
  extends Record<'percent' | 'progress', string> {}

export const ExampleCounters = (totalFiles: number): ExampleCounters => {
  let files = 0
  let examples = 0
  let filesWithExamples = 0

  return {
    readFile: () => {
      files++
    },

    readExample: () => {
      examples++
    },

    foundExampleInFile: () => {
      filesWithExamples++
    },

    get: () => ({
      files,
      examples,
      filesWithExamples,
      totalFiles,
    }),

    progress: (): CounterProgress => {
      const percent = ((100 * files) / totalFiles).toFixed(0).padStart(3)
      const progress = `${files.toString().padStart(3)}/${totalFiles.toString().padStart(3)}`
      return {percent, progress}
    },
  }
}
