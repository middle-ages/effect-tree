# Codecs

## Using

```ts
import {binaryTree, Codec} from 'effect-tree'

const tree: Tree<number> = binaryTree(3)

console.log(drawTree.numeric.unlines)

const encoded = Codec.Paths.encode(tree)

console.log(encoded)
// All leaf paths:
// [
//   [ 1, 2, 3 ],
//   [ 1, 2, 3 ],
//   [ 1, 2, 3 ],
//   [ 1, 2, 3 ],
// ]


```
