import {Draw} from 'effect-tree'

const {box, column, drawPart, empty, row, text} = Draw

// Two lists of text.
const leftCells = [text('↑'), text('left|'), text('↓')]
const rightCells = [text('↑'), text('|right'), text('↓')]

// A pair of columns.
const leftColumn = column.left(leftCells)
const rightColumn = column.right(rightCells)

// A row with the column pair and the empty part.
const bottomRow = row('middle')('center')([leftColumn, empty, rightColumn])

console.log(drawPart.unlines(box()(bottomRow)))
// ┌───────────┐
// │↑         ↑│
// │left||right│
// │↓         ↓│
// └───────────┘
