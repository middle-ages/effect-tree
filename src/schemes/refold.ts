import {hylo} from 'effect-ts-folds'
import * as TreeF from '#treeF'

/**
 * Fuse a fold and unfold into a single scheme to avoid traversing the tree more
 * than once.
 * @category refold
 */
export const treeHylo = hylo(TreeF.Traversable)
