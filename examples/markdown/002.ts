import {Arbitrary, type Tree, Codec, branch, leaf, nAryTree} from 'effect-tree'
import fc from 'fast-check'

// Manually
const myBranch = branch('1.', [leaf('2.1'), leaf('2.2')])

// Unfolding. Tree nodes will be set to node depth.
const myTernaryTree: Tree<number> = nAryTree({degree: 3, depth: 3})

// Decode from nested arrays.
const decodedTree: Tree<number> = Codec.Arrays.decode([1, [2, 3, [4, [5, 6]]]])

// Get the The 400,000,000,000,000th labeled tree with 16 nodes:
const enumeratedTree = Codec.Prufer.getNthTree(4n * 10n ** 14n, 16)

// Generate a tree using “fast-check”
const randomTree = fc.sample(
  Arbitrary.Tree.getArbitrary(fc.integer({min: 0, max: 10_000}), {
    branchBias: 1 / 4,
    maxDepth: 3,
    maxChildren: 5,
  }),
  {numRuns: 1, seed: 42},
)

console.log(myBranch, myTernaryTree, decodedTree, enumeratedTree, randomTree)
