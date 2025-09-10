import {match, type Tree} from '#tree'
import {mapInitLast} from '#util/Array'
import {flow, Function, pipe} from 'effect'
import type {NonEmptyReadonlyArray} from 'effect/Array'
import {atoms} from './atoms.js'
import * as PR from './part.js'
import type {Part} from './part/types.js'
import {foreachThemed, themed} from './theme.js'
import type {Theme} from './theme/themes.js'
import type {Themed} from './theme/types.js'

/** Convert a tree into a themed part. */
export const treeLayout = (tree: Tree<string>): Themed<Part> =>
  themed(theme =>
    pipe(
      tree,
      match({
        onLeaf: node => atoms.leafLabel(node)(theme),
        onBranch: parentLayout(theme),
      }),
    ),
  )

const parentLayout =
  (theme: Theme) =>
  (value: string, nodes: NonEmptyReadonlyArray<Tree<string>>): Part => {
    const parts: NonEmptyReadonlyArray<Themed<Part>> = [
      atoms.branchLabel(value),
      forestLayout(nodes),
    ]

    return pipe(parts, foreachThemed, Function.apply(theme), PR.leftColumn)
  }

const forestLayout = (
  trees: NonEmptyReadonlyArray<Tree<string>>,
): Themed<Part> => {
  return themed(theme => {
    const treePart = flow(treeLayout, Function.apply(theme))

    return pipe(
      trees,
      mapInitLast(
        flow(treePart, atoms.headBranch(theme)),
        flow(treePart, atoms.tailBranch(theme)),
      ),
      PR.leftColumn,
    )
  })
}
