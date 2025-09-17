import type {TreeFolderK} from '#tree'
import {treeCata} from '#tree'
import * as TreeF from '#treeF'
import {Array} from '#util'
import {identity, pipe} from 'effect'
import type {TreeArray, TreeArrayLambda, ValidArrayTree} from './types.js'

/**
 * Flatten a tree level into an `ArrayTree<A>`.
 *
 * This is unsafe in that any type can be substituted for `A`, yet at runtime,
 * if an array is found in some node value an exception will be thrown, because
 * we use `Array.isArray` to discriminate between leaves and branches.
 *
 * The function is perfectly safe if the type `A` is _not_ an array.
 * @category fold
 * @category codec
 */
export const unsafeEncodeFold: TreeFolderK<TreeArrayLambda> = <A>(
  treeF: TreeF.TreeF<A, TreeArray<A>>,
): TreeArray<A> => {
  if (Array.isArray(TreeF.getValue(treeF)))
    throw new Error('Cannot encode a tree of arrays as an array tree.')

  // To convert to nested arrays, at each node:
  //
  // •  on leaf   ⇒ return it
  // •  on branch ⇒ tuple it
  //
  return pipe(
    treeF,
    TreeF.match<A, TreeArray<A>, TreeArray<A>>({
      onLeaf: identity,
      onBranch: (node, forest) => [
        node,
        forest as Array.NonEmptyArray<TreeArray<A>>,
      ],
    }),
  )
}

/**
 * Encode a tree as nested arrays.
 * @category codec
 */
export const encode: <A>(tree: ValidArrayTree<A>) => TreeArray<A> = tree =>
  pipe(tree, treeCata(unsafeEncodeFold))
