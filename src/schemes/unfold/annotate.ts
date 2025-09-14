import * as TreeF from '#treeF'
import {pair, square} from '#util/Pair'
import {Array, Effect, flow, pipe} from 'effect'
import {getForest, getValue, match} from '../../tree/index.js'
import type {Tree} from '../../tree/types.js'
import type {TreeEffectUnfolder} from './types.js'

/**
 * @category unfold
 */
export const annotateEffectUnfolder =
  <A, B, E = never, R = never>(
    ψ: TreeEffectUnfolder<A, Tree<B>, E, R>,
  ): TreeEffectUnfolder<[B, A], [Tree<B>, A], E, R> =>
  ([self, value]) =>
    pipe(
      self,
      ψ,
      Effect.map((unfolded: TreeF.TreeF<A, Tree<B>>) => {
        const [b, a] = pipe(
          self,
          getValue,
          pipe(unfolded, TreeF.getValue, pair.withSecond),
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
                  square.mapSecond(flow(getForest, TreeF.treeF.flip(value))),
                ),
              ),
          }),
        )
      }),
    )
