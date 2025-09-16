import {pipe} from 'effect'
import {binaryTree, drawTree, of} from 'effect-tree'
import {fromTree, head, append, toTree} from 'effect-tree/zipper'

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
  // ┬1 ← start here
  // ├┬2
  // │├┬3
  // ││├─4
  // ││└─4
  // │└┬3
  // : :
  fromTree,
  // ┬1
  // ├┬2 ← go to 1st child of root
  // │├┬3
  // ││├─4
  // ││└─4
  // │└┬3
  // : :
  head,
  // ┬1
  // ├┬2
  // │├┬3 ← go to 1st child of 1st child of root
  // ││├─4
  // ││└─4
  // │└┬3
  // : :
  head,
  // ┬1
  // ├┬2
  // │├┬3
  // ││├─4
  // ││├─4
  // ││└─42 ← append here a new leaf
  // │└┬3
  // : :
  append(of(42)),
  // back to tree
  toTree,
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
