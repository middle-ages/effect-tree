import {pipe} from 'effect'
import {type Algebra, cata} from 'effect-ts-folds'
import {showAlignment} from './align.js'
import {
  type ColumnF,
  matchPartF,
  Traversable as PartFTraversable,
  type PartFTypeLambda,
  type RowF,
} from './partF.js'
import {type Part} from './types.js'
import {surround} from '#util/String'

export const partCata = cata(PartFTraversable)

export const showPartAlgebra: Algebra<PartFTypeLambda, string> = matchPartF(
  '∅',
  surround.quote.fancy,
  showRow,
  showColumn,
)

export const showPart = (part: Part): string =>
  pipe(part, partCata(showPartAlgebra))

function showRow({
  hAlign,
  vAlign,
  hStrut: {
    unfixed: {show},
  },
  cells,
}: RowF<string>): string {
  return [
    showAlignment(hAlign),
    showAlignment(vAlign) + '.',
    show === ' '
      ? ''
      : pipe(show, surround.quote.fancy, surround.squareBrackets),
    '(',
    cells.join(', '),
    ')',
  ].join('')
}

function showColumn({
  hAlign,
  hStrut: {
    unfixed: {show},
  },
  cells,
}: ColumnF<string>): string {
  return [
    showAlignment(hAlign) + '.',
    show === ' '
      ? ''
      : pipe(show, surround.quote.fancy, surround.squareBrackets),
    '(',
    cells.join(', '),
    ')',
  ].join('')
}
