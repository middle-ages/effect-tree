import {leaf, type Branch, type Tree} from '#tree'
import {Function, Record} from '#util'
import type {Predicate} from 'effect'
import fc from 'fast-check'

/**
 * Type of functions that build a tree arbitrary from the arbitrary runtime
 * options.
 */
export interface GetArbitrary<A> {
  (options: RuntimeOptions): fc.Arbitrary<Tree<A>>
}

/**
 * Tree arbitrary generation options.
 */
export interface ArbitraryOptions {
  /**
   * Minimum depth of trees generated. An error is thrown if
   * `minDepth > maxDepth`. Set to a value greater than `0` to guarantee only
   * branches will be generated and never leaves. Default is `0`.
   */
  minDepth: number

  /**
   * Maximum depth of trees generated. An error is thrown if
   * `minDepth > maxDepth`. Default is `3`.
   */
  maxDepth: number

  /** Max child count per branch. Default is `5`. */
  maxChildren: number

  /**
   * Ratio of trees generated that will be branches and not leaves. Expects
   * a ratio in the inclusive range of 0…1. Default is `¼`.
   */
  branchBias: number
}

/**
 * Numbered arbitrary tree generation options. A numbered arbitrary
 * tree has unique node values, one per each number in the inclusive
 * range `initialize`…`initialize + nodeCount - 1` where the root node
 * value is `initialize`.
 */
export interface NumberedArbitraryOptions extends ArbitraryOptions {
  /** Start numbering of nodes at this number. Default is `1`.*/
  initialize: number
}

/** props threaded through the recursive arbitrary for Tree<A>. */
export interface RuntimeOptions extends ArbitraryOptions {
  /**
   * Current depth from top. The value will be `0` for the root note,
   * `1` for the 1st level nodes, and so on.
   */
  currentDepth: number
}

export const defaultOptions: ArbitraryOptions = {
  maxChildren: 5,
  branchBias: 1 / 4,
  minDepth: 0,
  maxDepth: 3,
}

export const defaultNumberedOptions: NumberedArbitraryOptions = {
  ...defaultOptions,
  initialize: 1,
}

export const normalizeOptions = (
  options: Partial<ArbitraryOptions> = defaultOptions,
): ArbitraryOptions => {
  const final = {
    ...defaultOptions,
    ...Record.filterDefined(options),
  }

  const {minDepth, maxDepth, branchBias, maxChildren} = final

  if (minDepth > maxDepth) {
    const explain = `“${minDepth.toString()}” > “${maxDepth.toString()}”`
    throw new Error(`minDepth > maxDepth (${explain}).`)
  }

  if (branchBias < 0 || branchBias > 1) {
    const explain = `“${branchBias.toString()}” not in inclusive range 0…1`
    throw new Error(`Out-of-bounds branchBias (${explain}).`)
  }

  if (maxChildren <= 0) {
    const explain = `“${maxChildren.toString()}” <= 0`
    throw new Error(`Out-of-bounds maxChildren (${explain}).`)
  }

  return final
}

export const normalizeNumberedOptions = (
  options: Partial<NumberedArbitraryOptions> = defaultNumberedOptions,
): ArbitraryOptions => ({
  ...defaultNumberedOptions,
  ...Record.filterDefined(options),
})

/** If true, this level will be all leaves. */
export const isAtMaxDepth: Predicate.Predicate<RuntimeOptions> = ({
  maxDepth,
  currentDepth,
}) => currentDepth >= maxDepth

/**
 * If true, this level could include only leaves. If false,
 * this level will surely include at least a single branch.
 */
export const isAtMinDepth: Predicate.Predicate<RuntimeOptions> = ({
  minDepth,
  currentDepth,
}) => currentDepth >= minDepth + 1

/**
 * Choose one of the given leaf or branch arbitraries according to the branch
 * bias.
 */
export const biasedOneOf =
  <A>(a: fc.Arbitrary<A>, branch: fc.Arbitrary<Branch<A>>) =>
  ({branchBias}: ArbitraryOptions): fc.Arbitrary<Tree<A>> => {
    const bias = Math.round(100 * branchBias)
    return fc.oneof(
      {weight: 100 - bias, arbitrary: a.map(leaf)},
      {weight: bias, arbitrary: branch},
    )
  }

export const nextDepth: Function.EndoOf<RuntimeOptions> = ({
  currentDepth,
  ...options
}: RuntimeOptions) => ({
  ...options,
  currentDepth: currentDepth + 1,
})
