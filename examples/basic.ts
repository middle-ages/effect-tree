import {Option, pipe} from 'effect'
import {
  drawTree,
  drill,
  from,
  getValue,
  leaf,
  match,
  maximumNodeDegree,
  maximumNodeHeight,
  nthChild,
  tree,
  type Tree,
} from 'effect-tree'

const label = (name: string, note: string): string =>
  [`🌿 ${name} Branch`, `  (${note})`].join('\n')

// “tree” can be used to build trees with a single import.
// Note the “curried”, “flipped”, and “tupled” variants.
const stringTreeUsingTree: Tree<string> = tree('Root', [
  tree(label('Top', 'one node'), [tree('🍂 Leaf₁\n')]),

  tree(label('Middle', 'two nodes'), [
    tree.flipped('🍂 Leaf₂')(),
    tree.tupled(['🍂 Leaf₃\n']),
  ]),

  tree.curried([
    tree('🍂 Leaf₄'),
    tree('🍂 Leaf₅'),
    tree('🍂 Leaf₆'),
    tree('🍂 Leaf₇\n'),
  ])(label('Bottom', 'four nodes')),
])

console.log(drawTree.unixRounded.unlines(stringTreeUsingTree))

/*
─Root
 ├─🌿 Top Branch
 │ │  (one node)
 │ ╰─🍂 Leaf₁
 │
 ├─🌿 Middle Branch
 │ │  (two nodes)
 │ ├─🍂 Leaf₂
 │ ╰─🍂 Leaf₃
 │
 ╰─🌿 Bottom Branch
   │  (four nodes)
   ├─🍂 Leaf₄
   ├─🍂 Leaf₅
   ├─🍂 Leaf₆
   ╰─🍂 Leaf₇
*/

//  “from” is similar but requires less brackets.
const stringTreeUsingFrom: Tree<string> = from(
  'Root',
  from(label('Top', 'one node'), from('🍂 Leaf₁\n')),

  from(label('Middle', 'two nodes'), from('🍂 Leaf₂'), from('🍂 Leaf₃\n')),

  from(
    label('Bottom', 'four nodes'),
    from('🍂 Leaf₄'),
    from('🍂 Leaf₅'),
    from('🍂 Leaf₆'),
    from('🍂 Leaf₇\n'),
  ),
)

console.log(drawTree.unixRounded.unlines(stringTreeUsingFrom))

/*
─Root
 ├─🌿 Top Branch
 │ │  (one node)
 │ ╰─🍂 Leaf₁
 │
 ├─🌿 Middle Branch
 │ │  (two nodes)
 │ ├─🍂 Leaf₂
 │ ╰─🍂 Leaf₃
 │
 ╰─🌿 Bottom Branch
   │  (four nodes)
   ├─🍂 Leaf₄
   ├─🍂 Leaf₅
   ├─🍂 Leaf₆
   ╰─🍂 Leaf₇
*/

// you can match nodes to leaves or branches using “match”. Here we match on the
// root node:
const rootNodeType = (tree: Tree<string>): string =>
  pipe(
    tree,
    match({
      onLeaf: () => 'leaf',
      onBranch: (_, forest) =>
        `branch of forest.length=${forest.length.toString()}`,
    }),
  )

console.log(rootNodeType(stringTreeUsingTree))
/*
branch of forest.length=3
*/

// You can drill into the tree using “drill” and get node values using “getValue”:
console.log(
  pipe(
    [2, 0], // the 1st child in the 3rd child of the root node.
    drill(stringTreeUsingTree),
    Option.getOrElse(() => leaf('Wrong path!')),
    getValue,
  ),
)
/*
🍂 Leaf₄
*/

// Get direct children of a branch using “nthChild”/“firstChild”/“lastChild”.
// They all return Option<Tree<A>>. Note “nthChild” accepts negative indexes.
// This will get the same node value as above:
console.log(
  pipe(
    stringTreeUsingTree,
    nthChild.flip(-1),
    Option.flatMap(nthChild.flip(0)),
    Option.getOrElse(() => leaf('No such child!')),
    getValue,
  ),
)
/*
🍂 Leaf₄
*/

// Print max node child count and max node height:
console.log(
  maximumNodeHeight(stringTreeUsingTree),
  maximumNodeDegree(stringTreeUsingTree),
)
/*
3 4
*/
