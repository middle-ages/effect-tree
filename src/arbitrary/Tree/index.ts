import * as Tree from '#tree'
import fc from 'fast-check'
import {nonEmptyArrayArbitrary} from '../util.js'
import {
  biasedOneOf,
  isAtMaxDepth,
  nextDepth,
  normalizeOptions,
  type ArbitraryOptions,
  type GetArbitrary,
  type RuntimeOptions,
} from './options.js'
import {pipe} from 'effect'

export const getArbitrary = <A>(
  a: fc.Arbitrary<A>,
  rawOptions?: Partial<ArbitraryOptions>,
) => {
  const options = {...normalizeOptions(rawOptions), currentDepth: 1}
  const tree = arbitrary(a)
  return options.onlyBranches
    ? branchArbitrary(tree, a)(options)
    : tree(options)
}

const forestArbitrary = <A>(
  treeA: GetArbitrary<A>,
  options: RuntimeOptions,
): fc.Arbitrary<Tree.ForestOf<A>> =>
  nonEmptyArrayArbitrary(treeA(options), {
    maxLength: options.maxChildren,
  })

const branchArbitrary =
  <A>(treeA: GetArbitrary<A>, a: fc.Arbitrary<A>) =>
  (options: RuntimeOptions): fc.Arbitrary<Tree.Branch<A>> =>
    a.chain(a => forestArbitrary(treeA, options).map(Tree.branch.flip(a)))

const arbitrary =
  <A>(a: fc.Arbitrary<A>) =>
  (options: RuntimeOptions): fc.Arbitrary<Tree.Tree<A>> => {
    if (isAtMaxDepth(options)) {
      return a.map(Tree.leaf)
    }

    const nextOptions = nextDepth(options)

    return biasedOneOf(
      a,
      pipe(nextOptions, branchArbitrary(arbitrary(a), a)),
    )(nextOptions)
  }
