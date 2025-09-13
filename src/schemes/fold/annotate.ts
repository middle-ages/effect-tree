/**
 * Convert a fold into one that annotates tree nodes with its intermediate
 * values.
 * @packageDocumentation
 */
import * as TreeF from '#treeF'
import {Effect, flow, pipe, Tuple} from 'effect'
import {fixTree, getValue, tree} from '../../tree/index.js'
import {type Tree} from '../../tree/types.js'
import type {TreeEffectFolder, TreeFolder} from './types.js'

/**
 * Converts a fold `φ` into one that _annotates_ tree values: every tree node
 * will be annotated with the intermediate value of the fold at the node.
 *
 * For example, to convert the `descendantCount` fold, that folds a tree into a
 * _tree total descendant count_ to one that annotates each node with its
 * _node total descendant count_:
 *
 * ```ts
 * const annotated = pipe(
 *   tree(42, [leaf(43)]),
 *   self, treeCata(annotateFolder(folds.descendantCount))),
 * )
 * ```
 */
export const annotateFolder = <A, B>(
  φ: TreeFolder<A, B>,
): TreeFolder<A, Tree<[A, B]>> => flow(annotateNode(φ), fixTree)

/** Like {@link annotateFolder} but for _effect folders_. */
export const annotateEffectFolder =
  <A, B, E = never, R = never>(φ: TreeEffectFolder<A, B, E, R>) =>
  (self: TreeF.TreeF<A, Tree<[A, B]>>): Effect.Effect<Tree<[A, B]>, E, R> =>
    pipe(self, annotateNode(φ), TreeF.destruct, ([[a, effect], forest]) =>
      Effect.map(effect, b => tree([a, b], forest)),
    )

const annotateNode =
  <A, B, C>(φ: (tf: TreeF.TreeF<A, B>) => C) =>
  (self: TreeF.TreeF<A, Tree<[A, B]>>): TreeF.TreeF<[A, C], Tree<[A, B]>> =>
    pipe(
      self,
      TreeF.mapValue(
        a =>
          [
            a,
            pipe(self, TreeF.map(flow(getValue, Tuple.getSecond)), φ),
          ] as const,
      ),
    )
