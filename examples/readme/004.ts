import {binaryTree, drawTree} from 'effect-tree'
import {pipe} from 'effect'

//                           A variant of “drawTree” that renders
//                           numeric trees into a string
//                                         ┊
//                             ╭┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄╮
console.log(pipe(3, binaryTree, drawTree.number.unlines))
//┬1
//├┬2
//│├─3
//│└─3
//└┬2
// ├─3
// └─3
