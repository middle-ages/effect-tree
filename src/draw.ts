import type {Tree, TreeFolder} from '#tree'
import {treeCata} from '#tree'
import * as TreeF from '#treeF'
import {pipe} from 'effect'

export * from './draw/glyph.js'
export * from './draw/struts.js'
export * from './draw/tree.js'
export * from './draw/align.js'
export * from './draw/direction.js'
export * from './draw/part.js'
export * from './draw/parts.js'
export * from './draw/variants.js'
export * as PartF from './draw/partF.js'

/**
 * Format a string tree for debug output.
 * @internal
 */
export const show: (self: Tree<string>) => string = self =>
  pipe(self, treeCata(showFold))

/**
 * Format a single level of a string tree for debug output.
 * @internal
 */
export const showFold: TreeFolder<string, string> = TreeF.match({
  onLeaf: value => `“${value}”`,
  onBranch: (value, forest) => `“${value}”:(${forest.join(', ')})`,
})
