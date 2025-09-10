import type {Tree} from '#tree'
import {pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {treeLayout} from './layout.js'
import {draw} from './part.js'
import {getTheme, mapThemes, themed} from './theme.js'
import type {ThemeName} from './theme/themes.js'
import type {Themed} from './types.js'

export * from './part.js'
export type * from './part/types.js'

export const themedTree: Themed<(self: Tree<string>) => NonEmptyArray<string>> =
  themed(
    theme => (tree: Tree<string>) =>
      pipe(theme, treeLayout(tree), draw) as NonEmptyArray<string>,
  )

export const drawTree: ((self: Tree<string>) => NonEmptyArray<string>) &
  Record<ThemeName, (self: Tree<string>) => NonEmptyArray<string>> =
  Object.assign(pipe('thin', getTheme, themedTree), mapThemes(themedTree))
