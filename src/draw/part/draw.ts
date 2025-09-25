import {K} from '#util'
import {flatten, map, transpose, type NonEmptyArray2} from '#Array'
import {unlines, unwords} from '#String'
import {Array, Option, pipe} from 'effect'
import {type Algebra} from 'effect-ts-folds'
import {alignHorizontally, alignVertically} from '../align.js'
import {
  matchPartF,
  type ColumnF,
  type PartFTypeLambda,
  type RowF,
} from '../partF.js'
import {normalizeStruts} from '../struts.js'
import {partCata} from './fold.js'
import {type Part} from './types.js'

const drawFold: Algebra<PartFTypeLambda, string[]> = matchPartF(
  [],
  Array.of,
  drawRowF,
  drawColumnF,
)

/**
 * Render a part into a list of strings rows.
 * @param part - Part to be drawn.
 * @returns Possibly empty array of lines.
 * @category drawing
 * @function
 */
export const drawPart: {
  (part: Part): string[]
  unlines: (part: Part) => string
} = Object.assign(partCata(drawFold), {
  unlines: (part: Part): string => pipe(part, partCata(drawFold), unlines),
})

function drawRowF({
  hAlign,
  vAlign,
  cells: [cellsHead, ...cellsTail],
  ...struts
}: RowF<string[]>): string[] {
  if (cellsHead === undefined) {
    return []
  }

  const {left, right, top, bottom} = normalizeStruts(struts)
  const aligned = pipe(
    [cellsHead, ...cellsTail],
    alignVertically(
      {top, bottom},
      vAlign,
      alignHorizontally({left, right}, hAlign),
    ),
  ) as unknown as NonEmptyArray2<string>

  return pipe(
    aligned,
    transpose,
    map(map(Option.getOrElse(K(' ')))),
    map(unwords),
  )
}

function drawColumnF({cells, hAlign, ...hStruts}: ColumnF<string[]>): string[] {
  return pipe(cells, flatten, alignHorizontally(hStruts, hAlign))
}
