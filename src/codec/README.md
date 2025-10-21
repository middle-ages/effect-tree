# Codecs

There are five codecs that can encode/decode trees:

1. [Nested Arrays](https://middle-ages.github.io/effect-tree-docs/modules/Codec.Arrays.html)
1. [Edge List](https://middle-ages.github.io/effect-tree-docs/modules/Codec.Edges.html)
1. [Indented Strings](https://middle-ages.github.io/effect-tree-docs/modules/Codec.Indented.html)
1. [List of Leaf Paths](https://middle-ages.github.io/effect-tree-docs/modules/Codec.Paths.html)
1. [Prüfer Code](https://middle-ages.github.io/effect-tree-docs/modules/Codec.Prufer.html)

You will also find here:

1. [effect Schema](https://middle-ages.github.io/effect-tree-docs/modules/Codec.Schema.html) for the tree datatype.
2. A function that will convert a tree into the [effect Graph datatype](https://middle-ages.github.io/effect-tree-docs/modules/Codec.Graph.html), so you can, for example, draw the tree to [GraphViz](https://graphviz.org/).

## Using

Every codec can _encode_ and _decode_ losslessly to/from trees.

See also the [codec example](https://github.com/middle-ages/effect-tree/blob/main/examples/codecs.ts) showing the same tree encoded and decoded through every codec.

```ts
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
```
