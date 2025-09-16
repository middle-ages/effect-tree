import {Array} from 'effect'
import {
  drawTree,
  levelsFold,
  treeAna,
  TreeF,
  treeHylo,
  type Tree,
  type TreeFolder,
  type TreeUnfolder,
} from 'effect-tree'

type NonEmptyArray2<A> = Array.NonEmptyArray<Array.NonEmptyArray<A>>

type State = [current: number, previous: number, beforePrevious: number]

const unfolder: TreeUnfolder<number, State> = ([f0, f1, f2]) =>
  TreeF.treeF(f1, f0 === 0 ? [] : [[f0 - 1, f2, f1 + f2]])

const fibUnfold = (n: number): Tree<number> => treeAna(unfolder)([n - 1, 1, 2])

log(fibUnfold(10))
/*
 1. ┬1
 2. └┬2
 3.  └┬3
 4.   └┬5
 5.    └┬8
 6.     └┬13
 7.      └┬21
 8.       └┬34
 9.        └┬55
10.         └─89
*/

// Groups tree nodes at a tree level. A function of the type:
// (self: TreeF<number, NonEmptyArray2<number>>) ⇒ NonEmptyArray2<number>`
const folder: TreeFolder<number, NonEmptyArray2<number>> = levelsFold<number>

// Fuse the folder and unfolder to create a refold.
const refold: (state: State) => NonEmptyArray2<number> = treeHylo(
  unfolder,
  folder,
)

// nth Fibonacci number in linear time with no memoization.
const fibN = (n: number) =>
  refold([n - 1, 1, 2])
    .at(-1)
    ?.at(0)

console.log(fibN(100))
/*
573147844013817200000
*/

function log(tree: Tree<number>): void {
  console.log(drawTree.number.unlines(tree))
}
