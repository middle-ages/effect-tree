/**
 * Convert a fold into one that replaces tree nodes with its intermediate
 * values.
 * @packageDocumentation
 */
import * as TreeF from '#treeF'
import {Effect, pipe} from 'effect'
import {fixTree, getValue, treeC} from '../../tree/index.js'
import {type Tree} from '../../tree/types.js'
import type {TreeEffectFolder, TreeFolder} from './types.js'

/**
 * Converts a fold `φ` into one that _replaces_ tree values: every tree node
 * will be replaced with the intermediate value of the fold at the node.
 *
 * For example, to convert the `descendantCount` fold, that folds a tree into a
 * _tree total descendant count_ to one where each node value is the
 * _node total descendant count_:
 *
 * ```ts
 * const replaced = pipe(
 *   tree(42, [leaf(43)]),
 *   self, treeCata(replaceFolder(folds.descendantCount))),
 * )
 * ```
 */
export const replaceFolder =
  <A, B>(φ: TreeFolder<A, B>): TreeFolder<A, Tree<B>> =>
  self =>
    pipe(self, replaceNode(φ), fixTree)

/** Like {@link replaceFolder} but for _effect folders_. */
export const replaceEffectFolder =
  <A, B, E = never, R = never>(
    φ: TreeEffectFolder<A, B, E, R>,
  ): TreeEffectFolder<A, Tree<B>, E, R> =>
  self =>
    pipe(self, replaceNode(φ), TreeF.destruct, ([value, forest]) =>
      Effect.map(value, treeC(forest)),
    )

const replaceNode =
  <A, B, C>(φ: (tf: TreeF.TreeF<A, B>) => C) =>
  (self: TreeF.TreeF<A, Tree<B>>): TreeF.TreeF<C, Tree<B>> =>
    pipe(
      self,
      TreeF.mapValue(() => pipe(self, TreeF.map(getValue), φ)),
    )
