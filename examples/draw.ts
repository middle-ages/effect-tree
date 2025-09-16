import {Codec, drawTree, type Tree, Draw} from 'effect-tree'

// Get a nice looking 12-node tree from the list of all trees.
const tree: Tree<number> = Codec.Prufer.getNthTree(9_876_543_210, 12)

// Note we use the numeric.unlines variant which draws numeric trees to a string
// instead of a list of string rows.
log(drawTree.number.unlines(tree))
/*
┬1
└┬6
 └┬8
  ├┬2
  │├─3
  │└┬5
  │ └┬12
  │  └─7
  ├─9
  ├─10
  └┬11
   └─4
*/

// There are eight other themes, besides the default “thin” theme:
//
// 1. ascii
// 2. bullets
// 3. rounded
// 4. space
// 5. thick
// 6. doubleSpaceThin
// 7. thin
// 8. unix
// 9. unixRounded
//
// Each can be used through the named key of drawTree.
for (const themeName of Draw.themeNames) {
  log(`\nTheme: “${themeName}”`)
  log(drawTree[themeName].number.unlines(tree))
}
/*
Theme: “ascii”
+1
'-+6
  '-+8
    +-+2
    | +--3
    | '-+5
    |   '-+12
    |     '--7
    +--9
    +--10
    '-+11
      '--4

Theme: “bullets”
 ∘1
   ∘6
     ∘8
       ∘2
         ∙3
         ∘5
           ∘12
             ∙7
       ∙9
       ∙10
       ∘11
         ∙4

Theme: “rounded”
┬1
╰┬6
 ╰┬8
  ├┬2
  │├─3
  │╰┬5
  │ ╰┬12
  │  ╰─7
  ├─9
  ├─10
  ╰┬11
   ╰─4

Theme: “space”
 1
   6
     8
       2
         3
         5
           12
             7
       9
       10
       11
         4

Theme: “thick”
┳1
┗┳6
 ┗┳8
  ┣┳2
  ┃┣━3
  ┃┗┳5
  ┃ ┗┳12
  ┃  ┗━7
  ┣━9
  ┣━10
  ┗┳11
   ┗━4

Theme: “doubleSpaceThin”
┬1
│
└─┬6
  │
  └─┬8
    │
    ├─┬2
    │ │
    │ ├──3
    │ │
    │ └─┬5
    │   │
    │   └─┬12
    │     │
    │     └──7
    │
    ├──9
    │
    ├──10
    │
    └─┬11
      │
      └──4

Theme: “thin”
┬1
└┬6
 └┬8
  ├┬2
  │├─3
  │└┬5
  │ └┬12
  │  └─7
  ├─9
  ├─10
  └┬11
   └─4

Theme: “unix”
─1
 └─6
   └─8
     ├─2
     │ ├─3
     │ └─5
     │   └─12
     │     └─7
     ├─9
     ├─10
     └─11
       └─4

Theme: “unixRounded”
─1
 ╰─6
   ╰─8
     ├─2
     │ ├─3
     │ ╰─5
     │   ╰─12
     │     ╰─7
     ├─9
     ├─10
     ╰─11
       ╰─4
*/

function log(s: string): void {
  console.log(s)
}
