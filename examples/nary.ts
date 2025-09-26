import {Array, pipe} from 'effect'
import {Draw, nAryTree} from 'effect-tree'

const {borderBottom, borderSet, box, column, drawPart, drawTree, row, text} =
  Draw

// Draw unary, binary, and ternary N-ary trees.
console.log(
  pipe(
    Array.range(1, 3),
    Array.map(degreeTree),
    row.top.center,
    drawPart.unlines,
  ),
)

function label(degree: number): Draw.Part {
  return pipe(
    `degree…${degree.toString()}`,
    text,
    pipe('thin', borderSet, borderBottom),
  )
}

function degreeTree(degree: number): Draw.Part {
  return pipe(
    {degree, depth: 4},
    nAryTree.string,
    drawTree,
    Array.map(text),
    Array.prepend(label(degree)),
    column.center,
    box.curried(),
  )
}

/**
┌────────┐┌────────┐┌────────┐
│degree…1││degree…2││degree…3│
│────────││────────││────────│
│ ┬1     ││ ┬1     ││ ┬1     │
│ └┬2    ││ ├┬2    ││ ├┬2    │
│  └┬3   ││ │├┬3   ││ │├┬3   │
│   └─4  ││ ││├─4  ││ ││├─4  │
└────────┘│ ││└─4  ││ ││├─4  │
          │ │└┬3   ││ ││└─4  │
          │ │ ├─4  ││ │├┬3   │
          │ │ └─4  ││ ││├─4  │
          │ └┬2    ││ ││├─4  │
          │  ├┬3   ││ ││└─4  │
          │  │├─4  ││ │└┬3   │
          │  │└─4  ││ │ ├─4  │
          │  └┬3   ││ │ ├─4  │
          │   ├─4  ││ │ └─4  │
          │   └─4  ││ ├┬2    │
          └────────┘│ │├┬3   │
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
                    │ └┬2    │
                    │  ├┬3   │
                    │  │├─4  │
                    │  │├─4  │
                    │  │└─4  │
                    │  ├┬3   │
                    │  │├─4  │
                    │  │├─4  │
                    │  │└─4  │
                    │  └┬3   │
                    │   ├─4  │
                    │   ├─4  │
                    │   └─4  │
                    └────────┘

*/
