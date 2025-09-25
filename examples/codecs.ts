import {Array, Number, Option} from 'effect'
import {
  branch,
  Codec,
  drawTree,
  from,
  map,
  of,
  type Branch,
  type Tree,
} from 'effect-tree'

const {Arrays, Edges, Indented, Paths, Prufer} = Codec

// The numeric tree we will be encoding/decoding.
//
// Note we use the `branch` constructor so our type is narrowed from
// “Tree<number>” to “Branch<number>” for codecs that only work on
// branches and not leaves.
const numeric: Branch<number> = branch(1, [
  of(2),
  from(3, of(4), of(5), from(6, of(7))),
])

// A string version of same tree, useful for codecs like “indented” that
// can only work on string trees.
const stringy = map(numeric, s => s.toString())

console.log(drawTree.unlines(stringy))
/*
┬1
├─2
└┬3
 ├─4
 ├─5
 └┬6
  └─7
*/

// 1. NESTED ARRAYS
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const arraysEncoded: Codec.Arrays.TreeArray<number> = Arrays.encode(numeric)
console.dir(arraysEncoded, {depth: 10})
/*
[
  1,
  [
    2,
    [
      3,
      [ 4, 5, [ 6, [ 7 ] ] ]
    ]
  ]
]
*/

const arraysDecoded: Tree<number> = Arrays.decode([
  1,
  [2, [3, [4, 5, [6, [7]]]]],
])
console.log(drawTree.number.unlines(arraysDecoded))
/*
┬1
├─2
└┬3
 ├─4
 ├─5
 └┬6
  └─7
*/

// 2. EDGE LIST
// ┈┈┈┈┈┈┈┈┈┈┈┈

const edgeListEncoded: Array.NonEmptyArray<Codec.Edges.TreeEdge<number>> =
  Edges.encode(numeric)
console.dir(edgeListEncoded)
/*
[
  [ 1, {} ],
  [ 2, { value: 1 } ],
  [ 3, { value: 1 } ],
  [ 4, { value: 3 } ],
  [ 5, { value: 3 } ],
  [ 6, { value: 3 } ],
  [ 7, { value: 6 } ]
]
*/

const edgeListDecoded: Tree<number> = Edges.decode([
  [1, Option.none()],
  [2, Option.some(1)],
  [3, Option.some(1)],
  [4, Option.some(3)],
  [5, Option.some(3)],
  [6, Option.some(3)],
  [7, Option.some(6)],
])
console.log(drawTree.number.unlines(edgeListDecoded))
/*
┬1
├─2
└┬3
 ├─4
 ├─5
 └┬6
  └─7
*/

// 3. INDENTED STRINGS
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const indentEncoded = Indented.encode(stringy, 3)
console.dir(indentEncoded)
/*
[
  '1',
  '   2',
  '   3',
  '      4',
  '      5',
  '      6',
  '         7'
]
 */

const indentDecoded: Tree<string> = Indented.decode([
  '1',
  '   2',
  '   3',
  '      4',
  '      5',
  '      6',
  '         7',
])
console.log(drawTree.unlines(indentDecoded))
/*
┬1
├─2
└┬3
 ├─4
 ├─5
 └┬6
  └─7
*/

// 4. LEAF PATHS
// ┈┈┈┈┈┈┈┈┈┈┈┈┈

const pathEncoded: Array.NonEmptyArray<Array.NonEmptyArray<number>> =
  Paths.encode(numeric)

console.dir(pathEncoded)
/*
[ [ 1, 2 ], [ 1, 3, 4 ], [ 1, 3, 5 ], [ 1, 3, 6, 7 ] ]
 */

const pathDecoded: Tree<number> = Paths.decode(Number.Order)([
  [1, 2],
  [1, 3, 4],
  [1, 3, 5],
  [1, 3, 6, 7],
])
console.log(drawTree.number.unlines(pathDecoded))
/*
┬1
├─2
└┬3
 ├─4
 ├─5
 └┬6
  └─7
*/

// 5. PRÜFER CODES
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

const pruferEncoded: number[] = Prufer.encode(Number.Order)(numeric)

console.dir(pruferEncoded)
/*
[ 1, 3, 3, 6, 3 ]
*/

const pruferDecoded: Tree<number> = Prufer.decode([1, 3, 3, 6, 3])
console.log(drawTree.number.unlines(pruferDecoded))
/*
┬1
├─2
└┬3
 ├─4
 ├─5
 └┬6
  └─7
*/
