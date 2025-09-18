import {surround, unwords} from '#util/String'
import {showAlignment} from '../align.js'
import {type ColumnF, matchPartF, type RowF} from '../partF.js'
import {showHStrut, showVStrut} from '../struts.js'
import type {PartFolder} from './fold.js'
import {partCata} from './fold.js'
import {type Part} from './types.js'

/**
 * @category internal
 */
export const showPartAlgebra: PartFolder<string> = matchPartF(
  '∅',
  surround.quote.fancy,
  showRow,
  showColumn,
)

/**
 * @category internal
 */
export const showPart: (part: Part) => string = partCata(showPartAlgebra)

/**
 * @category internal
 */
function showRow({
  cells,
  hAlign,
  hStrut,
  vAlign,
  vStrut,
}: RowF<string>): string {
  return unwords.rest(
    showAlignment(hAlign),
    showAlignment(vAlign),
    showHStrut(hStrut),
    '.',
    showVStrut(vStrut),
    '(',
    cells.join(', '),
    ')',
  )
}

/**
 * @category internal
 */
function showColumn({hAlign, hStrut, cells}: ColumnF<string>): string {
  return unwords.rest(
    showAlignment(hAlign),
    showHStrut(hStrut),
    '(',
    cells.join(', '),
    ')',
  )
}
