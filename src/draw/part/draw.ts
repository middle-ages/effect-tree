import {transpose, type NonEmptyArray2} from '#util/Array'
import {Array, flow, pipe} from 'effect'
import {type Algebra} from 'effect-ts-folds'
import {getOrElse} from 'effect/Option'
import {alignHorizontally, alignVertically} from './align.js'
import {getText} from './data.js'
import {partCata} from './ops.js'
import {
  matchPartF,
  type ColumnF,
  type PartFTypeLambda,
  type RowF,
} from './partF.js'
import {type Part} from './types.js'

/**
 * Render a single layer of the part into a list of strings.
 * @category fold
 */
export const drawFold: Algebra<PartFTypeLambda, string[]> = matchPartF(
  [],
  Array.of,
  drawRowF,
  drawColumnF,
)

export const draw: (part: Part) => string[] = partCata(drawFold)

function drawRowF({
  hAlign,
  vAlign,
  hStrut,
  vStrut: [headVStrut, ...tailVStrut],
  cells: [head, ...rest],
}: RowF<string[]>): string[] {
  if (head === undefined) {
    return []
  }
  const aligned = alignVertically(
    [getText(headVStrut), ...pipe(tailVStrut, Array.map(getText))],
    vAlign,
    alignHorizontally(getText(hStrut), hAlign),
  )([head, ...rest]) as NonEmptyArray2<string>

  return pipe(
    aligned,
    transpose,
    Array.map(flow(Array.map(getOrElse(() => ' ')), Array.join(''))),
  )
}

function drawColumnF({hAlign, hStrut, cells}: ColumnF<string[]>): string[] {
  return pipe(cells, Array.flatten, alignHorizontally(getText(hStrut), hAlign))
}
