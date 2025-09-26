import {type Tree, drawTree, binaryTree, Codec, asOrdinal} from 'effect-tree'
import {Number, pipe} from 'effect'

// Make a tree of 7 nodes with the values 1-7 so each has a unique value.
// Nodes are given their count in depth-first post-order.
const tree: Tree<number> = pipe(3, binaryTree, asOrdinal(1))
console.log(drawTree.number.unlines(tree))
// ┬7
// ├┬3
// │├─1
// │└─2
// └┬6
//  ├─4
//  └─5

const encoded = Codec.Paths.encode(tree)
console.dir(encoded)
// For every leaf, the path from the root node to the leaf.
//
// [
//   [ 7, 3, 1 ],
//   [ 7, 3, 2 ],
//   [ 7, 6, 4 ],
//   [ 7, 6, 5 ],
// ]

const decoded = Codec.Paths.decode(Number.Order)(encoded)
console.log(drawTree.number.unlines(decoded))
// ┬7
// ├┬3
// │├─1
// │└─2
// └┬6
//  ├─4
//  └─5
