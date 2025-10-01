import {drawTree, unfold, type Tree} from 'effect-tree'

// Unfold a single level of a tree into a branch of degree 2
// or if we have reached the bottom and n=0, into a leaf.
const halfUnfolder: (n: number) => number[] = n => {
  const half = Math.floor(n / 2)
  return half === 0 ? [] : [half, half]
}

const unfolded: Tree<number> = unfold(halfUnfolder)(8)

console.log(drawTree.number.unlines(unfolded))
/*
┬8
├┬4
│├┬2
││├─1
││└─1
│└┬2
│ ├─1
│ └─1
└┬4
 ├┬2
 │├─1
 │└─1
 └┬2
  ├─1
  └─1
*/
