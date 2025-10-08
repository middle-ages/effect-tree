import {Array, Number, pipe} from 'effect'
import {flow, constant} from 'effect/Function'
import {
  annotateDepthUnfold,
  annotateFolder,
  Codec,
  drawTree,
  map,
  replaceFolder,
  structTreeFolds,
  treeCata,
  TreeF,
  treeHylo,
  zipTreeFolds,
  type Tree,
  type TreeFolder,
  type TreeFolderOf,
} from 'effect-tree'

// Get the nth possible labeled tree in constant time.
const treeOfZeros = pipe(
  Codec.Prufer.getNthTree(4n * 10n ** 14n, 16),
  map(constant(0)),
)

console.log('The 400,000,000,000,000th labeled tree with 16 nodes:')
logNumericTree(treeOfZeros)
/*
┬0
├─0
└┬0
 ├┬0
 │└┬0
 │ └┬0
 │  └─0
 ├┬0
 │├─0
 │└─0
 ├─0
 └┬0
  └┬0
   ├─0
   └┬0
    └─0
*/

// Run th given fold on our treeOfZeros.
const runFold = <A>(fold: TreeFolder<number, A>): A =>
  pipe(treeOfZeros, treeCata(fold))

// Run a folder on our treeOfZeros replacing and annotating tree nodes.
const showFold = <A>(
  name: string,
  folder: TreeFolder<number, A>,
  show: (a: A) => string,
) => {
  console.log(`“${name}” fold: ${pipe(folder, runFold, show)}`)
  console.log('replaced:')
  pipe(folder, replaceFolder, runFold, map(show), logStringTree)
  console.log('annotated:')
  pipe(
    folder,
    annotateFolder,
    runFold,
    map(([n, a]) => [n.toString(), show(a)].join(':')),
    logStringTree,
  )
}

const showFoldN = (name: string, folder: TreeFolder<number, number>) => {
  showFold(name, folder, s => s.toString())
}

// Find the maximum height of a branch at a tree level
const heightFold: TreeFolderOf<number> = TreeF.match({
  onLeaf: constant(1),
  onBranch: (_, forest) => Math.max(...forest) + 1,
})

// Count all descendants at any depth at a single tree level.
const descendentCountFold: TreeFolderOf<number> = TreeF.match({
  onLeaf: constant(1),
  onBranch: (_, forest) => Number.sumAll(forest) + 1,
})

// Run the “heightFold“
showFoldN('height', heightFold)
/*
“height” fold: 6
replaced:
┬6
├─1
└┬5
 ├┬4
 │└┬3
 │ └┬2
 │  └─1
 ├┬2
 │├─1
 │└─1
 ├─1
 └┬4
  └┬3
   ├─1
   └┬2
    └─1
annotated:
┬0:6
├─0:1
└┬0:5
 ├┬0:4
 │└┬0:3
 │ └┬0:2
 │  └─0:1
 ├┬0:2
 │├─0:1
 │└─0:1
 ├─0:1
 └┬0:4
  └┬0:3
   ├─0:1
   └┬0:2
    └─0:1
*/

// Run the “descendentCountFold”
showFoldN('descendentCount', descendentCountFold)
/*
“descendentCount” fold: 16
replaced:
┬16
├─1
└┬14
 ├┬4
 │└┬3
 │ └┬2
 │  └─1
 ├┬3
 │├─1
 │└─1
 ├─1
 └┬5
  └┬4
   ├─1
   └┬2
    └─1
annotated:
┬0:16
├─0:1
└┬0:14
 ├┬0:4
 │└┬0:3
 │ └┬0:2
 │  └─0:1
 ├┬0:3
 │├─0:1
 │└─0:1
 ├─0:1
 └┬0:5
  └┬0:4
   ├─0:1
   └┬0:2
    └─0:1
*/

// Zip the “heightFold” and the “descendentCountFold” in a single fold.
showFold(
  'height ¥ descendentCount',
  zipTreeFolds(heightFold, descendentCountFold),
  ([n, m]) => [n.toString(), m.toString()].join(':'),
)

/*
“height ¥ descendentCount” fold: 6:16
replaced:
┬6:16
├─1:1
└┬5:14
 ├┬4:4
 │└┬3:3
 │ └┬2:2
 │  └─1:1
 ├┬2:3
 │├─1:1
 │└─1:1
 ├─1:1
 └┬4:5
  └┬3:4
   ├─1:1
   └┬2:2
    └─1:1
annotated:
┬0:6:16
├─0:1:1
└┬0:5:14
 ├┬0:4:4
 │└┬0:3:3
 │ └┬0:2:2
 │  └─0:1:1
 ├┬0:2:3
 │├─0:1:1
 │└─0:1:1
 ├─0:1:1
 └┬0:4:5
  └┬0:3:4
   ├─0:1:1
   └┬0:2:2
    └─0:1:1
*/

const showNumericPair = (pair: readonly [number, number]): string =>
  pair.map(s => s.toString()).join(':')

// Zip the “heightFold” and the “descendentCountFold” in a single fold but also refold
// the zipped fold with the “annotateDepthUnfold”, all in a single tree traversal.
pipe(
  [treeOfZeros, 0] as [Tree<number>, 0],
  treeHylo(
    annotateDepthUnfold,
    annotateFolder(zipTreeFolds(heightFold, descendentCountFold)),
  ),
  map(
    flow(([a, b]) => [showNumericPair(a), showNumericPair(b)], Array.join(';')),
  ),
  logStringTree,
)
/*
┬0:1;6:16
├─0:2;1:1
└┬0:2;5:14
 ├┬0:3;4:4
 │└┬0:4;3:3
 │ └┬0:5;2:2
 │  └─0:6;1:1
 ├┬0:3;2:3
 │├─0:4;1:1
 │└─0:4;1:1
 ├─0:3;1:1
 └┬0:3;4:5
  └┬0:4;3:4
   ├─0:5;1:1
   └┬0:5;2:2
    └─0:6;1:1
*/

type Result = {
  height: number
  descendants: number
}

// Instead of zipping the folds, fuse them in a record with each getting their
// own key.
const structFold: TreeFolderOf<Result> = structTreeFolds({
  height: heightFold,
  descendants: descendentCountFold,
})

console.table(runFold(structFold))
/*
┌─────────────┬────────┐
│ (index)     │ Values │
├─────────────┼────────┤
│ height      │ 6      │
│ descendants │ 16     │
└─────────────┴────────┘
*/

function logStringTree(self: Tree<string>): void {
  console.debug(drawTree.unlines(self))
}

function logNumericTree(self: Tree<number>): void {
  console.debug(drawTree.number.unlines(self))
}
