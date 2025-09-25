import {Function, flow, Array, pipe} from '#util'
import {type ForestOf, type Tree, match} from '#tree'
import {mapInitLast} from '#Array'
import {flipCurried} from '#Function'
import type {NonEmptyReadonlyArray} from 'effect/Array'
import {type Part, column as columnPart} from '../part.js'
import {type Theme, type ThemedPart} from './theme.js'
import {branchLabel, headBranch, leafLabel, tailBranch} from './atoms.js'

/**
 * Convert a tree into a themed part.
 *
 * You can find a flipped version under the key `flip`.
 * @param tree The string tree to draw.
 * @category drawing
 * @function
 */
export const treeLayout = Object.assign(_treeLayout, {
  flip: flipCurried(_treeLayout),
})

function _treeLayout(tree: Tree<string>): ThemedPart {
  return (theme: Theme) =>
    pipe(
      tree,
      match({
        onLeaf: node => leafLabel(node)(theme),
        onBranch: parentLayout(theme),
      }),
    )
}

const parentLayout =
  (theme: Theme) =>
  (value: string, nodes: ForestOf<string>): Part => {
    const parts: NonEmptyReadonlyArray<ThemedPart> = [
      branchLabel(value),
      forestLayout(nodes),
    ]

    return pipe(parts, foreachThemed, Function.apply(theme), columnPart.left)
  }

const forestLayout =
  (trees: NonEmptyReadonlyArray<Tree<string>>): ThemedPart =>
  (theme: Theme) => {
    const treePart = flow(treeLayout, Function.apply(theme))

    return pipe(
      trees,
      mapInitLast(
        flow(treePart, headBranch(theme)),
        flow(treePart, tailBranch(theme)),
      ),
      columnPart.left,
    )
  }

function foreachThemed(xs: Array.NonEmptyReadonlyArray<ThemedPart>) {
  return (theme: Theme): Array.NonEmptyArray<Part> =>
    Array.map(xs, Function.apply(theme))
}
