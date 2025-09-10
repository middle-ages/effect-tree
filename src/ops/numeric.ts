/**
 * Working with numeric trees: sums, products, maximum, minimum, and average.
 * @packageDocumentation
 */
import {map, monoidFold, treeCata, type Tree, type TreeFolder} from '#tree'
import {flow, pipe, type Function} from '#util'
import {Monoid} from '@effect/typeclass'
import * as NumberData from '@effect/typeclass/data/Number'
import {
  MonoidMax,
  MonoidMin,
  MonoidMultiply,
  MonoidSum,
} from '@effect/typeclass/data/Number'

/**
 * A running average encoded as the _sum_ of all values encountered and the
 * _count_ of all values encountered.
 */
export interface RunningAverage {
  numerator: number
  denominator: number
}

/** A monoid for running a running average. */
export const MonoidAverage: Monoid.Monoid<RunningAverage> = Monoid.struct({
  numerator: NumberData.MonoidSum,
  denominator: NumberData.MonoidSum,
})

/** A starting value for a {@link RunningAverage}. */
export const RunningAverage: RunningAverage = {numerator: 0, denominator: 0}

/**
 * Compute a running average for a single level in a numeric tree.
 * @category fold
 */
export const averageFold: TreeFolder<RunningAverage, RunningAverage> = self =>
  pipe(self, monoidFold(MonoidAverage))

/**
 * Compute a running average for a single level in a numeric tree.
 * Sum the nodes of a single level in a numeric tree.
 * @category fold
 */
export const numericSumFold: TreeFolder<number, number> = self =>
  pipe(self, monoidFold(MonoidSum))

/**
 * Multiply the node values of a single level in a numeric tree.
 * @category fold
 */
export const numericProductFold: TreeFolder<number, number> = self =>
  pipe(self, monoidFold(MonoidMultiply))

/**
 * Find maximum node value in a level of a numeric tree.
 * @category fold
 */
export const numericMaxFold: TreeFolder<number, number> = self =>
  pipe(self, monoidFold(MonoidMax))

/**
 * Find minimum node value in a level of a numeric tree.
 * @category fold
 */
export const numericMinFold: TreeFolder<number, number> = self =>
  pipe(self, monoidFold(MonoidMin))

/** Sum all node values in a numeric tree. */
export const sum: (self: Tree<number>) => number = self =>
  pipe(self, treeCata(numericSumFold))

/** Multiply all node values in a numeric tree and return the product. */
export const multiply = (tree: Tree<number>): number =>
  pipe(tree, treeCata(numericProductFold))

/** Find max node value in a numeric tree. */
export const max = (tree: Tree<number>): number =>
  pipe(tree, treeCata(numericMaxFold))

/** Find min node value in a numeric tree. */
export const min = (tree: Tree<number>): number =>
  pipe(tree, treeCata(numericMinFold))

/** Collapse the sum and count of a running average into the average value. */
export const computeRunningAverage = ({
  numerator,
  denominator,
}: RunningAverage) => (denominator === 0 ? 0 : numerator / denominator)

export const updateRunningAverage =
  (newValue: number): Function.EndoOf<RunningAverage> =>
  average =>
    MonoidAverage.combine(average, {numerator: newValue, denominator: 1})

export const toRunningAverage = (numerator: number): RunningAverage => ({
  numerator,
  denominator: 1,
})

/** Compute the arithmetic mean of all node values in a numeric tree. */
export const average: (self: Tree<number>) => number = flow(
  map(toRunningAverage),
  treeCata(averageFold),
  computeRunningAverage,
)
