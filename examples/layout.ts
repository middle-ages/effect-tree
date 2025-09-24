import {String, pipe} from 'effect'
import {
  TreeF,
  map,
  nAryTree,
  treeCata,
  withOrdinal,
  type TreeFolder,
} from 'effect-tree'
import {
  HStrut,
  borderSet,
  box,
  column,
  drawPart,
  glyphGroups,
  row,
  text,
  type Part,
} from 'effect-tree/draw'

// A vertical tree layout for ternary trees.

const depth = 4

const self = pipe(
  {degree: 3, depth},
  nAryTree,
  withOrdinal(1),
  map(([depth, ordinal]) => ({depth, ordinal})),
)

const {cross, lines, elbows} = glyphGroups('thin')

const topLeft = (indent: number): HStrut =>
  HStrut([lines.top], String.repeat(indent)(' ') + elbows.topLeft)

const topRight = (indent: number): HStrut =>
  HStrut([lines.top], '', elbows.topRight + String.repeat(indent)(' '))

// Fold bottom-up a single level of a tree of numeric records with keys “depth”
// and “ordinal” into a Part.
const fold: TreeFolder<Record<'depth' | 'ordinal', number>, Part> = TreeF.match(
  {
    onLeaf: ({ordinal}) =>
      text(
        ordinal < 9
          ? ` ${ordinal.toString()} `
          : ordinal.toString().padStart(3),
      ),

    onBranch: ({ordinal, depth: branchDepth}, forest) => {
      const indent = Math.floor(3 ** (depth - branchDepth) / 2)

      //         bar         ← valuePart
      //
      // indent ┌─┼─┐ indent ← forkPart   ⎫
      //                                  ⎬ ← bottomPart
      //       foo bar       ← forestPart ⎭

      const valuePart = text(ordinal.toString())
      const forkPart = text(cross)
      const forestPart = row.bottom.center(forest)

      const bottomPart = column.center(
        [forkPart, forestPart],
        topLeft(indent),
        topRight(indent),
      )

      return column.center([valuePart, bottomPart])
    },
  },
)

const folded = pipe(
  self,
  treeCata(fold),
  box({border: borderSet('near')}),
  drawPart.unlines,
)

console.log(folded)

/*
 ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
▕                                       40                                        ▏
▕             ┌──────────────────────────┼──────────────────────────┐             ▏
▕            13                         26                         39             ▏
▕    ┌────────┼────────┐        ┌────────┼────────┐        ┌────────┼────────┐    ▏
▕    4        8       12       17       21       25       30       34       38    ▏
▕ ┌──┼──┐  ┌──┼──┐  ┌──┼──┐  ┌──┼──┐  ┌──┼──┐  ┌──┼──┐  ┌──┼──┐  ┌──┼──┐  ┌──┼──┐ ▏
▕ 1  2  3  5  6  7   9 10 11 14 15 16 18 19 20 22 23 24 27 28 29 31 32 33 35 36 37▏
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*/
