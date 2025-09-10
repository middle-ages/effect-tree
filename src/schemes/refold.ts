import {hylo} from 'effect-ts-folds'
import * as TreeF from '#treeF'

export const treeHylo = hylo(TreeF.Traversable)
