import * as TreeF from '#treeF'
import {pair, square} from '#util/Pair'
import {Array, Effect, flow, pipe} from 'effect'
import {getForest, getNode, match} from '../../tree/index.js'
import type {Tree} from '../../tree/types.js'
import type {TreeEffectUnfolder} from './types.js'
import type {TreeUnfolder} from './types.js'

export const annotateUnfolder =
  <A, B>(
    ψ: TreeUnfolder<A, Tree<B>>,
  ): TreeUnfolder<readonly [B, A], readonly [Tree<B>, A]> =>
  ([self]) => {
    const unfolded = ψ(self)
    return pipe(
      unfolded,
      pipe(self, getNode, pair.withFirst, TreeF.mapNode<A, readonly [B, A]>),
      TreeF.map(pair.withSecond(unfolded)),
    )
  }

export const annotateEffectUnfolder =
  <A, B, E = never, R = never>(
    ψ: TreeEffectUnfolder<A, Tree<B>, E, R>,
  ): TreeEffectUnfolder<[B, A], [Tree<B>, A], E, R> =>
  ([self, a0]) =>
    pipe(
      self,
      ψ,
      Effect.map((unfolded: TreeF.TreeF<A, Tree<B>>) => {
        const [b, a] = pipe(
          self,
          getNode,
          pipe(unfolded, TreeF.getNode, pair.withSecond),
        )

        return pipe(
          self,
          match({
            onLeaf: () => TreeF.leafF([b, a]),
            onBranch: (_, forest) =>
              TreeF.branchF(
                [b, a],
                Array.map(
                  forest,
                  square.mapSecond(
                    flow(getForest, forest => TreeF.treeF(a0, forest)),
                  ),
                ),
              ),
          }),
        )
      }),
    )
