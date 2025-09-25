import {type Tree, from, of, append} from 'effect-tree'

// Could be also imported from 'effect-tree- as “Codec”,
// and then accessed as “Codec.Indented”.
import {Indented} from 'effect-tree/codec'

const helloThere: Tree<string> = from('hello', of('there'))
const world: Tree<string> = append(helloThere, of('world'))

const encoded = Indented.encode.string(world)
console.log(encoded.join('\n'))
