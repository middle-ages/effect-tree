import {leaf, binaryTree, drawTree, Zipper} from 'effect-tree'
import {pipe} from 'effect'

console.log(
  pipe(
    3,
    binaryTree,
    Zipper.fromTree,
    Zipper.head,
    Zipper.head,
    Zipper.replace(leaf(42)),
    Zipper.toTree,
    drawTree.unixRound.number.unlines,
  ),
)
