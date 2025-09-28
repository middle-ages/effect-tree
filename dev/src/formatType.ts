import {pipe, String as STR, type Function} from '#util'
import {sep, basename} from 'node:path'
import type {Type} from 'ts-morph'

const effectImportPath: Function.EndoOf<string> = home =>
  `import("${home}/node_modules/effect/dist/dts/`

type Import = keyof typeof importMap

const shorthand: [long: string, short: string][] = [
  ['Array.NonEmptyArray', 'NonEmptyArray'],
]

const importMap = {
  draw: 'Draw',
  zipper: 'Zipper',
  treeF: 'TreeF',
  codec: 'Codec',
  'util/These': 'These',
  arbitrary: 'Arbitrary',
} as const

export const formatType =
  (home: string) =>
  (type: Type): string => {
    const text = type
      .getText()
      .replaceAll(`import("${home}/src/`, 'import("')
      .replaceAll(effectImportPath(home), 'import("effect/')
      .replaceAll(/import\("([^"]+)"\)\./g, (_, f) =>
        pipe(f as string, asImport, STR.suffix('.')),
      )

    return applyShorthand(text)
  }

const asImport: Function.EndoOf<string> = file => {
  const top = headSegment(file)
  return file.startsWith('effect/')
    ? basename(file)
    : top !== '' && top in importMap && top !== file
      ? importMap[top as Import]
      : top
}

const applyShorthand: Function.EndoOf<string> = s => {
  let current = s
  for (const [search, replace] of shorthand) {
    current = s.replaceAll(search, replace)
  }

  return current.replaceAll(/\b(\w+)\.(\w+)\b/g, (...xs: unknown[]) => {
    const [, a, b] = xs as [unknown, string, string]
    return a === b ? a : `${a}.${b}`
  })
}

const headSegment = (p: string) => {
  const split = p.split(sep)
  return (
    split[0] === '' || split[0] === 'effect' ? split[1] : split[0]
  ) as string
}
