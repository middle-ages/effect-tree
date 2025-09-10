import * as Tree from '#tree'
import {Array} from '#util'
import fc from 'fast-check'
import {nonEmptyArrayArbitrary} from '../util.js'
import {
  biasedOneOf,
  isAtMaxDepth,
  isAtMinDepth,
  nextDepth,
  normalizeOptions,
  type ArbitraryOptions,
  type GetArbitrary,
  type RuntimeOptions,
} from './options.js'

export const getArbitrary = <A>(
  a: fc.Arbitrary<A>,
  rawOptions?: Partial<ArbitraryOptions>,
) => {
  const options = {...normalizeOptions(rawOptions), currentDepth: 1}
  const tree = arbitrary(a)
  return options.minDepth > 0
    ? branchArbitrary(tree, a)(options)
    : tree(options)
}

const areAllLeaves: <A>(trees: Tree.ForestOf<A>) => boolean = Array.every(
  Tree.isLeaf,
)

// The given forest is all leaves, so add a single leaf child to
// the 1st node in the forest turning it into a branch.
const addOneDepth =
  <A>(a: fc.Arbitrary<A>) =>
  ([head, ...tail]: Tree.ForestOf<A>): fc.Arbitrary<Tree.ForestOf<A>> =>
    a.map(a => [Tree.append(head, Tree.leaf(a)), ...tail])

const forestArbitrary = <A>(
  treeA: GetArbitrary<A>,
  options: RuntimeOptions,
): fc.Arbitrary<Tree.ForestOf<A>> =>
  nonEmptyArrayArbitrary(treeA(options), {
    maxLength: options.maxChildren,
  })

const branchArbitrary =
  <A>(treeA: GetArbitrary<A>, a: fc.Arbitrary<A>) =>
  (options: RuntimeOptions): fc.Arbitrary<Tree.Branch<A>> => {
    const addDepth = addOneDepth(a),
      forest = forestArbitrary(treeA, options)

    return a.chain(a => {
      return isAtMinDepth(options)
        ? forest.map(Tree.branch.flip(a))
        : forest.chain((children: Tree.ForestOf<A>) => {
            if (!areAllLeaves(children)) {
              return fc.constant(Tree.branch(a, children))
            }
            return addDepth(children).map(Tree.branch.flip(a))
          })
    })
  }

const arbitrary =
  <A>(a: fc.Arbitrary<A>) =>
  (options: RuntimeOptions): fc.Arbitrary<Tree.Tree<A>> => {
    if (isAtMaxDepth(options)) {
      return a.map(Tree.leaf)
    }

    const nextOptions = nextDepth(options)

    const branch: fc.Arbitrary<Tree.Branch<A>> = branchArbitrary(
      arbitrary(a),
      a,
    )(nextOptions)

    return biasedOneOf(a, branch)(nextOptions)
  }
