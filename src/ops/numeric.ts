/** Folds and unfolds for numeric trees. */
import {monoidFold, treeCata, type Tree, type TreeFolder} from '#tree'
import {
  MonoidMax,
  MonoidMin,
  MonoidMultiply,
  MonoidSum,
} from '@effect/typeclass/data/Number'
import {pipe} from 'effect'

/** Sum the nodes of a single level in a numeric tree. */
export const numericSumFold: TreeFolder<number, number> = self =>
    pipe(self, monoidFold(MonoidSum)),
  /** Multiply the node values of a single level in a numeric tree. */
  numericProductFold: TreeFolder<number, number> = self =>
    pipe(self, monoidFold(MonoidMultiply)),
  /** Find maximum node value in a level of a numeric tree. */
  numericMaxFold: TreeFolder<number, number> = self =>
    pipe(self, monoidFold(MonoidMax)),
  /** Find minimum node value in a level of a numeric tree. */
  numericMinFold: TreeFolder<number, number> = self =>
    pipe(self, monoidFold(MonoidMin))

/** Sum all node values in a numeric tree. */
export const sum: (self: Tree<number>) => number = self =>
    pipe(self, treeCata(numericSumFold)),
  /** Multiply all node values in a numeric tree and return the product. */
  multiply = (tree: Tree<number>): number =>
    pipe(tree, treeCata(numericProductFold)),
  /** Find max node value in a numeric tree. */
  max = (tree: Tree<number>): number => pipe(tree, treeCata(numericMaxFold)),
  /** Find min node value in a numeric tree. */
  min = (tree: Tree<number>): number => pipe(tree, treeCata(numericMinFold))
