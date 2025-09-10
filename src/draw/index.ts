/**
 * Render trees to a rectangle of glyphs for terminal display.
 * @packageDocumentation
 */
import type {Tree} from '#tree'
import {pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {treeLayout} from './layout.js'
import {draw} from './part.js'
import {getTheme, mapThemes, themed} from './theme.js'
import type {ThemeName} from './theme/themes.js'
import type {Themed} from './theme.js'

export * from './part.js'

/** Draw a tree as a 2D array of glyphs in the given theme. */
export const themedTree: Themed<(self: Tree<string>) => NonEmptyArray<string>> =
  themed(
    theme => (tree: Tree<string>) =>
      pipe(theme, treeLayout(tree), draw) as NonEmptyArray<string>,
  )

/** Draw a tree as a 2D array of glyphs. */
export const drawTree: ((self: Tree<string>) => NonEmptyArray<string>) &
  Record<ThemeName, (self: Tree<string>) => NonEmptyArray<string>> =
  Object.assign(pipe('thin', getTheme, themedTree), mapThemes(themedTree))
