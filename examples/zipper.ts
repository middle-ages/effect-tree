import {pipe} from 'effect'
import {binaryTree, drawTree, of, Zipper} from '../index.js'

const tree = binaryTree(4)
console.log(drawTree.number.unlines(tree))
/**

┬1
├┬2
│├┬3
││├─4
││└─4
│└┬3
│ ├─4
│ └─4
└┬2
 ├┬3
 │├─4
 │└─4
 └┬3
  ├─4
  └─4
 
 */

// Append a leaf to the forest of a node.
const updated = pipe(
  tree,
  // start at root
  Zipper.fromTree,
  // goto first child of root
  Zipper.unsafeHead,
  // goto first child of first child of root
  Zipper.unsafeHead,
  // append a leaf to its forest
  Zipper.append(of(42)),
  // back to tree
  Zipper.toTree,
)
console.log(drawTree.number.unlines(updated))

/**

┬1
├┬2
│├┬3
││├─4
││├─4
││└─42
│└┬3
│ ├─4
│ └─4
└┬2
 ├┬3
 │├─4
 │└─4
 └┬3
  ├─4
  └─4
 
 */
