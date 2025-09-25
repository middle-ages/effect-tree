import {type Tree, from, append, of, drawTree, Codec} from 'effect-tree'

const myLeaf = of('🍁')
console.log(drawTree.unlines(myLeaf))
// ─🍁

const helloThere: Tree<string> = from('hello', of('there'))
const world: Tree<string> = append(helloThere, of('world'))

const encoded = Codec.Indented.encode(world)
console.log(encoded.join('\n'))
// hello
//   there
//   world
