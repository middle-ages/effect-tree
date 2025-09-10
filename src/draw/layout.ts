import {match, type Tree} from '#tree'
import {mapInitLast} from '#util/Array'
import {flow, Function, pipe} from 'effect'
import type {NonEmptyReadonlyArray} from 'effect/Array'
import {flipCurried} from '../util/Function.js'
import {atoms} from './atoms.js'
import * as PR from './part.js'
import type {Part} from './part/types.js'
import {foreachThemed, themed} from './theme.js'
import type {Theme} from './theme/themes.js'
import type {Themed} from './theme/types.js'

/**
 * Convert a tree into a themed part.
 *
 * You can find a flipped version under the key `flip`.
 * @param tree - The string tree to draw.
 * @category drawing
 */
export const treeLayout = Object.assign(_treeLayout, {
  flip: flipCurried(_treeLayout),
})

function _treeLayout(tree: Tree<string>): Themed<Part> {
  return themed(theme =>
    pipe(
      tree,
      match({
        onLeaf: node => atoms.leafLabel(node)(theme),
        onBranch: parentLayout(theme),
      }),
    ),
  )
}

const parentLayout =
  (theme: Theme) =>
  (value: string, nodes: NonEmptyReadonlyArray<Tree<string>>): Part => {
    const parts: NonEmptyReadonlyArray<Themed<Part>> = [
      atoms.branchLabel(value),
      forestLayout(nodes),
    ]

    return pipe(parts, foreachThemed, Function.apply(theme), PR.column.left)
  }

const forestLayout = (
  trees: NonEmptyReadonlyArray<Tree<string>>,
): Themed<Part> =>
  themed(theme => {
    const treePart = flow(treeLayout, Function.apply(theme))

    return pipe(
      trees,
      mapInitLast(
        flow(treePart, atoms.headBranch(theme)),
        flow(treePart, atoms.tailBranch(theme)),
      ),
      PR.column.left,
    )
  })
