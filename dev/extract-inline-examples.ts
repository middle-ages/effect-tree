import {Array} from '#util'
import {
  ExampleCounters,
  getSourceExamples,
  initProject,
  logFindExamples,
  logSourceExample,
  walkSources,
  writeExample,
  type WalkInfo,
} from './typescript.js'

// Relative path from project root where inline examples will be written.
const inlineExamplesRelative = process.argv[2]

// If given then only this source file is extracted.
const examplePath = process.argv[3]

walkSources(initProject(), examplePath)(
  walker,

  main => {
    logFindExamples()
    return ExampleCounters(main.length)
  },

  (log, counters) => {
    const {examples, filesWithExamples} = counters.get()
    log.end(examples, filesWithExamples)
  },
)

// Extract inline examples and write them to the inline examples folder.
function walker({home, file, log}: WalkInfo, counters: ExampleCounters): void {
  counters.readFile()
  const write = writeExample(inlineExamplesRelative)

  // Extract inline examples for a single source file.
  const examples = getSourceExamples(home, file)

  if (!Array.isNonEmptyArray(examples)) {
    log.progress(counters.progress())
    return
  }

  counters.foundExampleInFile()
  log.begin(counters.progress(), file)
  const logExample = logSourceExample(examples.length)

  let exampleIndex = 0
  for (const example of examples) {
    exampleIndex++
    counters.readExample()
    logExample.start(exampleIndex, example)

    // Write the example as a test.
    write(example)
  }
}
