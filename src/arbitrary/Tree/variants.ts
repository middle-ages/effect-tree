import * as Codec from '#codec'
import {asOrdinal, asOrdinalBranch} from '#ops'
import {filterDefined, monoRecord} from '#Record'
import {fromNumber} from '#String'
import {map, type Branch, type Tree} from '#tree'
import {pipe} from '#util'
import fc from 'fast-check'
import {voidArbitrary} from '../util.js'
import {getArbitrary} from './index.js'
import type {ArbitraryOptions, NumberedArbitraryOptions} from './options.js'

/**
 * A tree with nothing but structure.
 * @category arbitrary
 * @function
 */
export const voidTreeArbitrary = (
  options?: Partial<ArbitraryOptions>,
): fc.Arbitrary<Tree<void>> => getArbitrary(voidArbitrary, options)

/**
 * A branch with nothing but structure.
 * @category arbitrary
 * @function
 */
export const voidBranchArbitrary = (
  options: Partial<Omit<ArbitraryOptions, 'onlyBranches'>> = {},
): fc.Arbitrary<Branch<void>> =>
  getArbitrary(voidArbitrary, {
    onlyBranches: true,
    ...filterDefined(options),
  }) as fc.Arbitrary<Branch<void>>

/**
 * Just like {@link getArbitrary} except the tree is
 * numeric and the the node values will be the unique ordinal of the node in
 * depth-first order.
 * @category arbitrary
 * @function
 */
export const getNumberedArbitrary = (
  options?: Partial<NumberedArbitraryOptions>,
): fc.Arbitrary<Tree<number>> =>
  voidTreeArbitrary(options).map(asOrdinal.pre(options?.initialize ?? 1))

/**
 * @category arbitrary
 * @function
 */
export const getNumberedBranchArbitrary = (
  options: Partial<NumberedArbitraryOptions> = {},
): fc.Arbitrary<Branch<number>> =>
  voidBranchArbitrary(options).map(asOrdinalBranch.pre(options.initialize ?? 1))

/**
 * Just like {@link getNumberedArbitrary} except the numeric nodes
 * have been stringified.
 * @category arbitrary
 * @function
 */
export const getStringArbitrary = (
  options?: Partial<NumberedArbitraryOptions>,
): fc.Arbitrary<Tree<string>> =>
  getNumberedArbitrary(options).map(map(fromNumber))

/**
 * An arbitrary for a valid Prüfer code with the given node count, by default
 * `3`. An arbitrary for a Prüfer code must obey these laws:
 *
 * 1. Number of codes is `nodeCount - 2`.
 * 2. Every code in the array is in th range `1 ≤ code ≤ nodeCount`.
 *
 * The set of codes generated is in bijection with all vertex trees of
 * `nodeCount` nodes.
 *
 * The 1st Prüfer code is `[]` which decodes to the only possible vertex tree at
 * node count `2`:
 *
 * ```txt
 * ┬1
 * └─2
 * ```
 * @category arbitrary
 */
export const getPruferCodeArbitrary = (
  nodeCount: number = 3,
): fc.Arbitrary<number[]> => {
  return fc.array(
    fc.integer({min: 1, max: nodeCount}),
    pipe(
      nodeCount,
      Codec.Prufer.codeCount,
      monoRecord,
    )('minLength', 'maxLength'),
  )
}

/**
 * A tree that can be encoded to a prüfer code has several requirements:
 *
 * 1. Root node value = `1`.
 * 2. For each number in the inclusive range 2…nodeCount there exists a single
 *    non-root node with that value.
 * 3. If you want round-trip encode/decode, make sure the branches are sorted.
 *    These six trees, for example, have the same prüfer code of `1, 1`:
 *
 * ```txt
 *   •─┬─1  •─┬─1   •─┬─1   •─┬─1   •─┬─1   •─┬─1
 *     ├──2   ├──2    ├──3    ├──3    ├──4    ├──4
 *     ├──3   ├──4    ├──2    ├──4    ├──2    ├──3
 *     └──4   └──3    └──4    └──2    └──3    └──2
 *   ┈┈┈┈┈┈ ┈┈┈┈┈┈  ┈┈┈┈┈┈  ┈┈┈┈┈┈  ┈┈┈┈┈┈  ┈┈┈┈┈┈
 *     I      II     III      IV       V      VI
 * ```
 * @category arbitrary
 */
export const getPruferEncodableArbitrary = (
  nodeCount?: number,
): fc.Arbitrary<Branch<number>> =>
  getPruferCodeArbitrary(nodeCount).map(Codec.Prufer.decode)
