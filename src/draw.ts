import type {Tree, TreeFolder} from '#tree'
import {treeCata} from '#tree'
import * as TreeF from '#treeF'
import {pipe} from 'effect'

export * from './draw/index.js'
export * from './draw/theme.js'

/** Format a string tree for debug output. */
export const show: (self: Tree<string>) => string = self =>
  pipe(self, treeCata(showFold))

/** Format a single level of a string tree for debug output. */
export const showFold: TreeFolder<string, string> = TreeF.match({
  onLeaf: value => `“${value}”`,
  onBranch: (value, forest) => `“${value}”:(${forest.join(', ')})`,
})
