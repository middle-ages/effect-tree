import {asOrdinal, asOrdinalBranch, nodeCountAtLeast} from '#ops'
import {
  append,
  branch,
  firstChild,
  getValue,
  leaf,
  map,
  tree,
  type Branch,
  type Tree,
} from '#tree'
import {Array, pipe, Record, String} from '#util'
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
    ...Record.filterDefined(options),
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
  getNumberedArbitrary(options).map(map(String.fromNumber))

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
export const pruferEncodableArbitrary: fc.Arbitrary<Branch<number>> =
  getNumberedBranchArbitrary().chain(self =>
    nodeCountAtLeast(3)(self)
      ? fc.constant(self)
      : // If tree is not big enough, we add a node at one of the two possible
        // locations: as child of root or as child of the 1st child of root.
        fc.oneof(
          fc.constant(append(self, leaf(3))),
          fc.constant(
            branch(getValue(self), [
              pipe(
                self,
                firstChild,
                getValue,
                pipe(3, leaf, Array.of, tree.curried),
              ),
            ]),
          ),
        ),
  )
