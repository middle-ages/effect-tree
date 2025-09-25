import {surround, unwords} from '#String'
import {showAlignment} from '../align.js'
import {type ColumnF, matchPartF, type RowF} from '../partF.js'
import {showHStruts, showStruts} from '../struts.js'
import type {PartFolder} from './fold.js'
import {partCata} from './fold.js'
import {type Part} from './types.js'

/**
 * @category internal
 * @function
 */
export const showPartAlgebra: PartFolder<string> = matchPartF(
  '∅',
  surround.quote.fancy,
  showRow,
  showColumn,
)

/**
 * @category internal
 * @function
 */
export const showPart: (part: Part) => string = partCata(showPartAlgebra)

/**
 * @category internal
 * @function
 */
function showRow({cells, hAlign, vAlign, ...struts}: RowF<string>): string {
  return unwords.rest(
    showAlignment(hAlign),
    showAlignment(vAlign),
    '.',
    showStruts(struts),
    '(',
    cells.join(', '),
    ')',
  )
}

/**
 * @category internal
 * @function
 */
function showColumn({hAlign, cells, ...hStruts}: ColumnF<string>): string {
  return unwords.rest(
    showAlignment(hAlign),
    showHStruts(hStruts),
    '(',
    cells.join(', '),
    ')',
  )
}
