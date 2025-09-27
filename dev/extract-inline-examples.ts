import {Array, pipe, String} from '#util'
import * as path from 'node:path'
import {
  addTestImports,
  ExampleCounters,
  getSourceExamples,
  logFindExamples,
  logSourceExample,
  walkSources,
  wrapBody,
  type SourceDoc,
} from './typescript.js'

// Relative path from project root where inline examples will be written
const inlineExamplesRelative = process.argv[2]

// Extract inline examples and write them to the inline examples folder.
walkSources(
  ({home, file, log}, counters: ExampleCounters): void => {
    counters.readFile()

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
      writeExample(example)
    }
  },

  main => {
    logFindExamples()
    return ExampleCounters(main.length)
  },

  (log, counters) => {
    const {examples, filesWithExamples} = counters.get()
    log.end(examples, filesWithExamples)
  },
)

function writeExample({
  home,
  variableName,
  folder,
  exampleSource,
  file,
  doc,
}: SourceDoc) {
  if (inlineExamplesRelative === undefined || inlineExamplesRelative === '') {
    throw new Error('No path to inline examples.')
  }

  const writePath = path.join(
    home,
    inlineExamplesRelative,
    folder,
    `${file}-${variableName}.test.ts`,
  )

  const code = pipe(exampleSource, addTestImports, String.unlines)

  const source = doc
    .getProject()
    .createSourceFile(writePath, code, {overwrite: true})

  wrapBody(source, [`test('${file}.${variableName}', ()  => {`], ['})'])

  source.saveSync()
}
