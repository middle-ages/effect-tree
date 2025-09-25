import {of, drawTree} from 'effect-tree'

const myLeaf = of('🍁')
console.log(drawTree.unlines(myLeaf))
