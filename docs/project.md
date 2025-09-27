# Project

1. [`package.json` scripts](#packagejson-scripts)
2. [Project, Readme, and Inline Examples](#project-readme-and-inline-examples)
3. [Dev Dependencies](#dev-dependencies)
4. [Coverage](#coverage)

## `package.json` scripts

| Script                    | About                                                                                                                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clean`                   | Clean generated files                                                                                                                                                                    |
| `check`                   | Runs everything that could expose issues in parallel using a single command. Will run all of 1.`circular`, 2.`test:examples`, 3.`coverage`, 4.`build`, 6.`lint:fix`, and 7.`build:docs`. |
| `repl`                    | [Starts a REPL playground](https://github.com/middle-ages/effect-tree/blob/main/dev/repl.ts).                                                                                            |
| `extract:inline:examples` | Extracts inline examples from source code into `examples/inline`                                                                                                                         |
| `lint`                    | Runs ESlint/Prettier.                                                                                                                                                                    |
| `lint:fix`                | Runs ESlint/Prettier with autofix.                                                                                                                                                       |
| `lint:clean`              | Runs ESlint/Prettier with no caching.                                                                                                                                                    |
| `test`                    | Runs project unit tests.                                                                                                                                                                 |
| `test:watch`              | Runs project unit tests in watch mode.                                                                                                                                                   |
| `coverage`                | Runs project unit tests with coverage.                                                                                                                                                   |
| `test:project:examples`   | Runs snapshot tests on project examples.                                                                                                                                                 |
| `test:markdown:examples`  | Runs snapshot tests on markdown examples.                                                                                                                                                |
| `test:inline:examples`    | Extracts inline examples from source and tests them.                                                                                                                                     |
| `test:examples`           | Test all examples.                                                                                                                                                                       |
| `run:example`             | Runs the given project example by name. For example `pnpm run:example draw`. Run with no arguments to list all the example you can run.                                                  |
| `typecheck`               | Type checking of all sources, including all examples, using `tsc`.                                                                                                                       |
| `circular`                | Tests for circular dependencies.                                                                                                                                                         |
| `build`                   | Runs `tsc` on sources.                                                                                                                                                                   |
| `build:docs`              | Runs [Typedoc](https://typedoc.org/index.html) to generate API documentation into `api:docs/`.                                                                                           |
| `npm`                     | Runs `check` then publishes docs and library.                                                                                                                                            |

## Project, Readme, and Inline Examples

Note there are three types of examples:

1. **Project Examples** Are all in the `examples/` top-level folder.
1. **README Examples** Appear in markdown code blocks, and as typescript files
   under `examples/readme`.
1. **Inline API Examples** Appear above source code declarations under
   `@example` tags, and as typescript files under `examples/inline`, where the
   `extract-inline` package.json script will extract them.

## Dev Dependencies

1. [Typescript](https://www.npmjs.com/package/typescript)
    1. [@tsconfig/strictest](https://www.npmjs.com/package/@tsconfig/strictest)
       and
       [@tsconfig/node24](https://www.npmjs.com/package/@tsconfig/node24)
    1. [Dependency Cruiser](https://www.npmjs.com/package/dependency-cruiser)
    1. [ts-morph](https://www.npmjs.com/package/ts-morph)
    1. [tsx](https://www.npmjs.com/package/tsx)
    1. [typedoc](https://www.npmjs.com/package/typedoc)
1. Testing
    1. [Vitest](https://www.npmjs.com/package/vitest)
    1. [fast-check](https://www.npmjs.com/package/fast-cheeck)
    1. [@fast-check/vitest](https://www.npmjs.com/package/@fast-check/vitest)
    1. [@effect/vitest](https://www.npmjs.com/package/@effect/vitest)
    1. [effect-ts-laws](https://www.npmjs.com/package/effect-ts-laws)
1. Linting/formatting
    1. [ESLint](https://www.npmjs.com/package/eslint)
        1. [Typescript ESLint](https://www.npmjs.com/package/typescript-eslint)
        1. [ESLint SonarJS Rules](https://www.npmjs.com/package/eslint-plugin-sonarjs)
        1. [ESLint Unicorn Rules](https://www.npmjs.com/package/eslint-plugin-unicorn)
    1. [Prettier](https://www.npmjs.com/package/prettier)

## Coverage

Report [can be found here](https://middle-ages.github.io/effect-tree-docs/coverage/index.html).
