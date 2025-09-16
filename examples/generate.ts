import {drawTree, type Tree} from 'effect-tree'
import fc from 'fast-check'
import {Prufer} from 'effect-tree/codec'
import {getArbitrary} from 'effect-tree/arbitrary/Tree'

const treeCount5 = Prufer.labeledTreeCount(5)
console.log(
  `There are ${treeCount5.toString()} sorted labeled trees with 5 nodes.`,
)
/*
There are 125 sorted labeled trees with 5 nodes.
*/

// All 16 sorted labeled trees with 4 nodes. Helpful for exhaustive testing.
const trees4 = Prufer.allTreesAt(4)
for (let i = 0; i < 16; i++) {
  console.log(`\n${(i + 1).toString()}.----------`)
  console.log(drawTree.number.unlines(trees4[i] as Tree<number>))
}
/*
 1.    2.     3.     4.
┬1    ┬1     ┬1     ┬1    
├─2   ├┬2    ├─2    ├─2   
├─3   │└─4   └┬3    └┬4   
└─4   └─3     └─4    └─3  
                    
 5.    6.     7.      8.   
┬1    ┬1     ┬1      ┬1    
├┬2   └┬2    └┬3     └┬4   
│└─3   ├─3    └┬2     └┬2  
└─4    └─4     └─4     └─3 
                 
 9.   10.    11.    12.  
┬1    ┬1     ┬1     ┬1    
├┬3   └┬2    └┬3    └┬4   
│└─2   └┬3    ├─2    └┬3  
└─4     └─4   └─4     └─  
                   
13.   14.    15.    16.  
┬1    ┬1     ┬1     ┬1
├─3   └┬2    └┬3    └┬4
└┬4    └┬4    └┬4    ├─2
 └─2    └─3    └─2   └─3
*/

// To get a random tree use “getArbitrary”:
const arbitrary = getArbitrary(fc.integer({min: 0, max: 10_000}), {
  branchBias: 1 / 2,
  maxChildren: 5,
  maxDepth: 4,
  onlyBranches: true,
})

// Four random trees.
const generated = fc.sample(arbitrary, {seed: 42, numRuns: 4})
for (const tree of generated) {
  console.log(drawTree.number.unlines(tree))
}
/*
┬9989
├─7040
├─9543
├┬5731
│└┬878
│ ├┬1428
│ │├─1106
│ │├─1253
│ │└─6615
│ └─2133
└─1395
┬7507
└┬8
 ├┬4
 │├┬5319
 ││└─1259
 │├─138
 │├─6633
 │├┬5576
 ││├─4010
 ││├─1984
 ││├─4342
 ││└─2111
 │└─2016
 ├─9988
 ├─9998
 └─9522
┬6212
└┬9360
 ├─4620
 └┬1873
  └┬4204
   ├─4952
   ├─4658
   ├─5382
   └─3189
┬0
└─3149
*/
