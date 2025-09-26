# Project

## `package.json` scripts

| Script                   | About                                                                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clean`                  | Clean generated files                                                                                                                                                                    |
| `check`                  | Runs everything that could expose issues in parallel using a single command. Will run all of 1.`circular`, 2.`test:examples`, 3.`coverage`, 4.`build`, 6.`lint:fix`, and 7.`build:docs`. |
| `repl`                   | [Starts a REPL playground](https://github.com/middle-ages/effect-tree/blob/main/dev/repl.ts).                                                                                            |
| `extract:inline:examples`| Extracts inline examples from source code into `examples/inline`                                                                                                                         |
| `lint`                   | Runs ESlint/Prettier.                                                                                                                                                                    |
| `lint:fix`               | Runs ESlint/Prettier with autofix.                                                                                                                                                       |
| `lint:clean`             | Runs ESlint/Prettier with no caching.                                                                                                                                                    |
| `test`                   | Runs project unit tests.                                                                                                                                                                 |
| `test:watch`             | Runs project unit tests in watch mode.                                                                                                                                                   |
| `coverage`               | Runs project unit tests with coverage.                                                                                                                                                   |
| `test:project:examples`  | Runs snapshot tests on project examples.                                                                                                                                                 |
| `test:markdown:examples` | Runs snapshot tests on markdown examples.                                                                                                                                                |
| `test:inline:examples`   | Extracts inline examples from source and tests them.                                                                                                                                     |
| `test:examples`          | Test all examples.                                                                                                                                                                       |
| `run:example`            | Runs the given project example by name. For example `pnpm run:example draw`. Run with no arguments to list all the example you can run.                                                  |
| `typecheck`              | Type checking of all sources, including all examples, using `tsc`.                                                                                                                       |
| `circular`               | Tests for circular dependencies.                                                                                                                                                         |
| `build`                  | Runs `tsc` on sources.                                                                                                                                                                   |
| `build:docs`             | Runs [Typedoc](https://typedoc.org/index.html) to generate API documentation into `api:docs/`.                                                                                           |
| `npm`                    | Runs `check` then publishes docs and library.                                                                                                                                            |

## Project, Readme, and Inline Examples

Note there are three types of examples:

1. **Project Examples** Are all in the `examples/` top-level folder.
1. **README Examples** Appear in markdown code blocks, and as typescript files
   under `examples/readme`.
1. **Inline API Examples** Appear above source code declarations under
   `@example` tags, and as typescript files under `examples/inline`, where the
   `extract-inline` package.json script will extract them.
