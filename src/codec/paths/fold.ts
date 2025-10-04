import {type NonEmptyArray2TypeLambda, type TreeFolderK} from '#tree'
import * as TreeF from '#treeF'
import {type NonEmptyArray2} from '#Array'
import {Array, pipe} from 'effect'

/**
 * Collect all leaf paths from a tree at a level. For example:
 *
 * ```ts
 * const tree = make('A', [of('B'), make('C', [of('D', 'E')])])
 *
 * const paths = treeCata(pathListFold)(tree)
 * // [['A', 'B'], ['A', 'C', 'D'], ['A', 'C', 'E']]
 *
 * ```
 * @category fold
 * @category codec
 * @function
 */
export const pathListFold: TreeFolderK<NonEmptyArray2TypeLambda> = <A>(
  tree: TreeF.TreeF<A, NonEmptyArray2<A>>,
): NonEmptyArray2<A> =>
  pipe(
    tree,
    TreeF.match({
      onLeaf: node => [[node]] as NonEmptyArray2<A>,
      onBranch: (node, forest) =>
        pipe(
          forest,
          Array.flatten,
          Array.map(xs => [node, ...xs]),
        ),
    }),
  )
