import {Array, Function, pipe} from 'effect'
import {Codec, Draw, drawTree, type Tree} from 'effect-tree'

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

// There are 23 other themes, besides the default “thin” theme:
//
//  1. ascii
//  2. bullets
//  3. space
//  4. dashed
//  5. dashedWide
//  6. dotted
//  7. double
//  8. hDouble
//  9. hThick
// 10. hThickDashed
// 11. hThickDashedWide
// 12. hThickDotted
// 13. round
// 14. thick
// 14. thickDashed
// 15. thickDashedWide
// 16. thickDotted
// 17. unix
// 18. unixRound
// 19. vDouble
// 20. vThick
// 21. vThickDashed
// 22. vThickDashedWide
// 23. vThickDotted
//
// Each can be used through the named key of the “drawTree” function,
// and the names are all available at “Draw.themeNames”.
const themeGroups = Array.chunksOf(Draw.themeNames, 6)

// Add label center below part and pad
const addLabel =
  (name: string) =>
  (part: Draw.Part): Draw.Part =>
    pipe(name, Draw.text, Draw.above.center(part), Draw.spacePad({left: 1}))

const rows = Array.map(themeGroups, group =>
  Draw.row.bottom.left(
    pipe(
      group,
      Array.map(themeName =>
        pipe(
          themeName,
          Draw.getTheme,
          Draw.treeToPart.number,
          Function.apply(tree),
          Draw.box.curried(),
          addLabel(themeName),
        ),
      ),
    ),
  ),
)

for (const row of rows) {
  log(Draw.drawPart.unlines(row))
}
/*

  dashed    dashedWide    dotted      double     hDouble      hThick    hThickDashed  hThickDashedWide
 ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   ┌────────┐      ┌────────┐
 │┬1      │  │┬1      │  │┬1      │  │╦1      │  │╤1      │  │┯1      │   │┯1      │      │┯1      │
 │└┬6     │  │└┬6     │  │└┬6     │  │╚╦6     │  │╘╤6     │  │┕┯6     │   │┕┯6     │      │┕┯6     │
 │ └┬8    │  │ └┬8    │  │ └┬8    │  │ ╚╦8    │  │ ╘╤8    │  │ ┕┯8    │   │ ┕┯8    │      │ ┕┯8    │
 │  ├┬2   │  │  ├┬2   │  │  ├┬2   │  │  ╠╦2   │  │  ╞╤2   │  │  ┝┯2   │   │  ┝┯2   │      │  ┝┯2   │
 │  ┆├┄3  │  │  ╎├╌3  │  │  ┊├┈3  │  │  ║╠═3  │  │  │╞═3  │  │  │┝━3  │   │  ┆┝┅3  │      │  ╎┝╍3  │
 │  ┆└┬5  │  │  ╎└┬5  │  │  ┊└┬5  │  │  ║╚╦5  │  │  │╘╤5  │  │  │┕┯5  │   │  ┆┕┯5  │      │  ╎┕┯5  │
 │  ┆ └┬12│  │  ╎ └┬12│  │  ┊ └┬12│  │  ║ ╚╦12│  │  │ ╘╤12│  │  │ ┕┯12│   │  ┆ ┕┯12│      │  ╎ ┕┯12│
 │  ┆  └┄7│  │  ╎  └╌7│  │  ┊  └┈7│  │  ║  ╚═7│  │  │  ╘═7│  │  │  ┕━7│   │  ┆  ┕┅7│      │  ╎  ┕╍7│
 │  ├┄9   │  │  ├╌9   │  │  ├┈9   │  │  ╠═9   │  │  ╞═9   │  │  ┝━9   │   │  ┝┅9   │      │  ┝╍9   │
 │  ├┄10  │  │  ├╌10  │  │  ├┈10  │  │  ╠═10  │  │  ╞═10  │  │  ┝━10  │   │  ┝┅10  │      │  ┝╍10  │
 │  └┬11  │  │  └┬11  │  │  └┬11  │  │  ╚╦11  │  │  ╘╤11  │  │  ┕┯11  │   │  ┕┯11  │      │  ┕┯11  │
 │   └┄4  │  │   └╌4  │  │   └┈4  │  │   ╚═4  │  │   ╘═4  │  │   ┕━4  │   │   ┕┅4  │      │   ┕╍4  │
 └────────┘  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘   └────────┘      └────────┘


 hThickDotted    round       thick     thickDashed  thickDashedWide  thickDotted     thin           unix
  ┌────────┐   ┌────────┐  ┌────────┐  ┌────────┐     ┌────────┐     ┌────────┐   ┌────────┐  ┌──────────────┐
  │┯1      │   │┬1      │  │┳1      │  │┳1      │     │┳1      │     │┳1      │   │┬1      │  │─1            │
  │┕┯6     │   │╰┬6     │  │┗┳6     │  │┗┳6     │     │┗┳6     │     │┗┳6     │   │└┬6     │  │ └─6          │
  │ ┕┯8    │   │ ╰┬8    │  │ ┗┳8    │  │ ┗┳8    │     │ ┗┳8    │     │ ┗┳8    │   │ └┬8    │  │   └─8        │
  │  ┝┯2   │   │  ├┬2   │  │  ┣┳2   │  │  ┣┳2   │     │  ┣┳2   │     │  ┣┳2   │   │  ├┬2   │  │     ├─2      │
  │  ┊┝┉3  │   │  │├─3  │  │  ┃┣━3  │  │  ┇┣┅3  │     │  ╏┣╍3  │     │  ┋┣┉3  │   │  │├─3  │  │     │ ├─3    │
  │  ┊┕┯5  │   │  │╰┬5  │  │  ┃┗┳5  │  │  ┇┗┳5  │     │  ╏┗┳5  │     │  ┋┗┳5  │   │  │└┬5  │  │     │ └─5    │
  │  ┊ ┕┯12│   │  │ ╰┬12│  │  ┃ ┗┳12│  │  ┇ ┗┳12│     │  ╏ ┗┳12│     │  ┋ ┗┳12│   │  │ └┬12│  │     │   └─12 │
  │  ┊  ┕┉7│   │  │  ╰─7│  │  ┃  ┗━7│  │  ┇  ┗┅7│     │  ╏  ┗╍7│     │  ┋  ┗┉7│   │  │  └─7│  │     │     └─7│
  │  ┝┉9   │   │  ├─9   │  │  ┣━9   │  │  ┣┅9   │     │  ┣╍9   │     │  ┣┉9   │   │  ├─9   │  │     ├─9      │
  │  ┝┉10  │   │  ├─10  │  │  ┣━10  │  │  ┣┅10  │     │  ┣╍10  │     │  ┣┉10  │   │  ├─10  │  │     ├─10     │
  │  ┕┯11  │   │  ╰┬11  │  │  ┗┳11  │  │  ┗┳11  │     │  ┗┳11  │     │  ┗┳11  │   │  └┬11  │  │     └─11     │
  │   ┕┉4  │   │   ╰─4  │  │   ┗━4  │  │   ┗┅4  │     │   ┗╍4  │     │   ┗┉4  │   │   └─4  │  │       └─4    │
  └────────┘   └────────┘  └────────┘  └────────┘     └────────┘     └────────┘   └────────┘  └──────────────┘


    unixRound       vDouble      vThick    vThickDashed  vThickDashedWide  vThickDotted       ascii             bullets
 ┌──────────────┐  ┌────────┐  ┌────────┐   ┌────────┐      ┌────────┐      ┌────────┐   ┌──────────────┐  ┌───────────────┐
 │─1            │  │╥1      │  │┰1      │   │┰1      │      │┰1      │      │┰1      │   │+1            │  │ ∘1            │
 │ ╰─6          │  │╙╥6     │  │┖┰6     │   │┖┰6     │      │┖┰6     │      │┖┰6     │   │'-+6          │  │   ∘6          │
 │   ╰─8        │  │ ╙╥8    │  │ ┖┰8    │   │ ┖┰8    │      │ ┖┰8    │      │ ┖┰8    │   │  '-+8        │  │     ∘8        │
 │     ├─2      │  │  ╟╥2   │  │  ┠┰2   │   │  ┠┰2   │      │  ┠┰2   │      │  ┠┰2   │   │    +-+2      │  │       ∘2      │
 │     │ ├─3    │  │  ║╟─3  │  │  ┃┠─3  │   │  ┇┠┄3  │      │  ╏┠╌3  │      │  ┋┠┈3  │   │    | +--3    │  │         ∙3    │
 │     │ ╰─5    │  │  ║╙╥5  │  │  ┃┖┰5  │   │  ┇┖┰5  │      │  ╏┖┰5  │      │  ┋┖┰5  │   │    | '-+5    │  │         ∘5    │
 │     │   ╰─12 │  │  ║ ╙╥12│  │  ┃ ┖┰12│   │  ┇ ┖┰12│      │  ╏ ┖┰12│      │  ┋ ┖┰12│   │    |   '-+12 │  │           ∘12 │
 │     │     ╰─7│  │  ║  ╙─7│  │  ┃  ┖─7│   │  ┇  ┖┄7│      │  ╏  ┖╌7│      │  ┋  ┖┈7│   │    |     '--7│  │             ∙7│
 │     ├─9      │  │  ╟─9   │  │  ┠─9   │   │  ┠┄9   │      │  ┠╌9   │      │  ┠┈9   │   │    +--9      │  │       ∙9      │
 │     ├─10     │  │  ╟─10  │  │  ┠─10  │   │  ┠┄10  │      │  ┠╌10  │      │  ┠┈10  │   │    +--10     │  │       ∙10     │
 │     ╰─11     │  │  ╙╥11  │  │  ┖┰11  │   │  ┖┰11  │      │  ┖┰11  │      │  ┖┰11  │   │    '-+11     │  │       ∘11     │
 │       ╰─4    │  │   ╙─4  │  │   ┖─4  │   │   ┖┄4  │      │   ┖╌4  │      │   ┖┈4  │   │      '--4    │  │         ∙4    │
 └──────────────┘  └────────┘  └────────┘   └────────┘      └────────┘      └────────┘   └──────────────┘  └───────────────┘


      space
 ┌──────────────┐
 │ 1            │
 │   6          │
 │     8        │
 │       2      │
 │         3    │
 │         5    │
 │           12 │
 │             7│
 │       9      │
 │       10     │
 │       11     │
 │         4    │
 └──────────────┘

*/

function log(s: string): void {
  console.log(s)
}
