import {Option, pipe} from 'effect'
import {addLevelLabels, binaryTree, drawTree, drill, map, of} from 'effect-tree'
import {
  append,
  fromTree,
  getValue,
  head,
  headN,
  toTree,
  tryHeadN,
} from 'effect-tree/zipper'
import {constant} from 'effect/Function'

const tree = pipe(4, binaryTree, map(constant('')), addLevelLabels)
console.log(drawTree.unlines(tree))
/*
─┬1. 
 ╰─┬───────────────────┐
   ├1.1.               ├1.2.                          
   ╰─┬─────────┐       ╰─┬─────────┐ 
     ├1.1.1.   ├1.1.2.   ├1.2.1.   ├1.2.2.
     ╰─┐       ╰─┐       ╰─┐       ╰─┐          
       ├1.1.1.1. ├1.1.2.1. ├1.2.1.1. ├1.2.2.1.
       ╰1.1.1.2. ╰1.1.2.2. ╰1.2.1.2. ╰1.2.2.2.

*/

const zipper = fromTree(tree)

// Navigate and get the node labeled “1.1.1.1”
const lastValue: string = pipe(
  //─┬1. ← start here
  // ╰─┬─────────╌
  //   ├1.1.
  //   ╰─┬───────╌
  //     ├1.1.1.
  //     :
  zipper,

  //─┬1.
  // ╰─┬─────────╌
  //   ├1.1. ← goto 1st child of root
  //   ╰─┬───────╌
  //     ├1.1.1.
  //     :
  head,

  //─┬1.
  // ╰─┬─────────╌
  //   ├1.1.
  //   ╰─┬───────╌
  //     ├1.1.1. ← goto 1st child of 1st child of root
  head,

  //─┬1.
  // ╰─┬─────────╌
  //   ├1.1.
  //   ╰─┬───────╌
  //     ├1.1.1.
  //     ╰─┐
  //       ╰1.1.1.1. ← and go down to 1st child again
  head,

  // Get the node value at our destination.
  getValue,
)
console.log(`head × 3=${lastValue}`)
/*
head × 3=1.1.1.1.
*/

// The “repeat” combinator will repeat a navigation N times, and there are
// repeating variants of “head” and “last” called “headN” and “lastN”.
// Above can be rewritten:
console.log(`headN × 1=${pipe(zipper, headN(3), getValue)}`)
/*
headN × 1=1.1.1.1.
*/

// The same can be done with `drill`:
console.log(
  `drill\n${pipe([0, 0, 0], drill(tree), Option.getOrThrow, drawTree.unlines)}`,
)
/*
drill
─1.1.1.1.
*/

// But the zipper can also modify the tree. For example: append a leaf to the
// forest of a node at the destination of the zipper.
const updated = pipe(
  tree,
  fromTree,
  head,
  head,
  append(of('I am a new node.')),
  toTree,
)
console.log(drawTree.unlines(updated))
/*
─┬1. 
 ╰─┬───────────────────┐
   ├1.1.               ├1.2.                          
   ╰─┬─────────┐       ╰─┬─────────┐ 
     ├1.1.1.   ├1.1.2.   ├1.2.1.   ├1.2.2.
     ╰─┐       ╰─┐       ╰─┐       ╰─┐          
       ├1.1.1.1. ├1.1.2.1. ├1.2.1.1. ├1.2.2.1.
       ├1.1.1.2. ╰1.1.2.2. ╰1.2.1.2. ╰1.2.2.2.
       ╰I am a new node.
*/

// The unsafe versions above will throw an exception on invalid paths.
// If you are unsure of the path validity, you can use the safe versions.
// They have the same names but prefixed with “try”.
// Navigate safely to an invalid path:
const invalid = pipe(
  tree,
  fromTree,
  tryHeadN(8), // Invalid path takes us deeper than possible
)

console.log(`invalid path=${Option.isNone(invalid).toString()}`)
/*
invalid path=true
*/
