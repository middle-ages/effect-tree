import {Array, pipe} from 'effect'
import {nAryTree} from 'effect-tree'
import {
  borderBottom,
  borderSet,
  box,
  column,
  drawPart,
  drawTree,
  row,
  text,
  type Part,
} from 'effect-tree/draw'

// Draw unary, binary, and ternary N-ary trees.
console.log(
  pipe(
    Array.range(1, 3),
    Array.map(degreeTree),
    row.bottom.center,
    drawPart.unlines,
  ),
)

function label(degree: number): Part {
  return pipe(
    `degree…${degree.toString()}`,
    text,
    pipe('thin', borderSet, borderBottom),
  )
}

function degreeTree(degree: number): Part {
  return pipe(
    {degree, depth: 4},
    nAryTree.string,
    drawTree,
    Array.map(text),
    Array.prepend(label(degree)),
    column.center,
    box(),
  )
}

/**
                    ┌────────┐
                    │degree…3│
                    │────────│
                    │ ┬1     │
                    │ ├┬2    │
                    │ │├┬3   │
                    │ ││├─4  │
                    │ ││├─4  │
                    │ ││└─4  │
                    │ │├┬3   │
                    │ ││├─4  │
                    │ ││├─4  │
                    │ ││└─4  │
                    │ │└┬3   │
                    │ │ ├─4  │
                    │ │ ├─4  │
                    │ │ └─4  │
                    │ ├┬2    │
                    │ │├┬3   │
                    │ ││├─4  │
                    │ ││├─4  │
                    │ ││└─4  │
                    │ │├┬3   │
                    │ ││├─4  │
                    │ ││├─4  │
          ┌────────┐│ ││└─4  │
          │degree…2││ │└┬3   │
          │────────││ │ ├─4  │
          │ ┬1     ││ │ ├─4  │
          │ ├┬2    ││ │ └─4  │
          │ │├┬3   ││ └┬2    │
          │ ││├─4  ││  ├┬3   │
          │ ││└─4  ││  │├─4  │
          │ │└┬3   ││  │├─4  │
          │ │ ├─4  ││  │└─4  │
          │ │ └─4  ││  ├┬3   │
┌────────┐│ └┬2    ││  │├─4  │
│degree…1││  ├┬3   ││  │├─4  │
│────────││  │├─4  ││  │└─4  │
│ ┬1     ││  │└─4  ││  └┬3   │
│ └┬2    ││  └┬3   ││   ├─4  │
│  └┬3   ││   ├─4  ││   ├─4  │
│   └─4  ││   └─4  ││   └─4  │
└────────┘└────────┘└────────┘
*/
