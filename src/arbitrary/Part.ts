import {fixPart} from '#draw/part/data'
import {type Text} from '#draw/part/partF'
import type {Column, Empty, Part, Row} from '#draw/part/types'
import * as fc from 'fast-check'
import {
  EmptyPartFArbitrary,
  getColumnFArbitrary,
  getRowFArbitrary,
  TextPartArbitrary,
} from './PartF.js'
import {
  mapHorizontalAlignments,
  mapVerticalAlignments,
  type Aligned,
  type VerticallyAligned,
  type HorizontallyAligned,
} from '#draw'

const EmptyPartArbitrary: fc.Arbitrary<Empty> = EmptyPartFArbitrary.map(
  unfixed => ({unfixed}),
)

/**
 * An arbitrary for a recursive {@link Part} that describes how to render a
 * rectangular block.
 * @category arbitrary
 */
export const Arbitrary = (options?: {
  maxDepth?: number
}): fc.Arbitrary<Part> => {
  const {maxDepth = 3} = options ?? {}

  return fc.letrec(tie => {
    const [tiePart, tieEmpty, tieText, tieColumn, tieRow] = [
      tie('part') as fc.Arbitrary<Part>,
      tie('empty') as fc.Arbitrary<Empty>,
      tie('text') as fc.Arbitrary<Text>,
      tie('column') as fc.Arbitrary<Column>,
      tie('row') as fc.Arbitrary<Row>,
    ]

    return {
      empty: EmptyPartArbitrary,
      text: TextPartArbitrary,
      column: getColumnFArbitrary(tiePart).map(fixPart),
      row: getRowFArbitrary(tiePart).map(fixPart),
      part: fc.oneof({maxDepth}, tieEmpty, tieText, tieColumn, tieRow),
    }
  }).part
}

/**
 * @category arbitrary
 */
export const HorizontalArbitrary: fc.Arbitrary<HorizontallyAligned> = fc.oneof(
  ...mapHorizontalAlignments(hAlign => fc.constant({hAlign})),
)

/**
 * @category arbitrary
 */
export const VerticalArbitrary: fc.Arbitrary<VerticallyAligned> = fc.oneof(
  ...mapVerticalAlignments(vAlign => fc.constant({vAlign})),
)

/**
 * @category arbitrary
 */
export const AlignedArbitrary: fc.Arbitrary<Aligned> =
  HorizontalArbitrary.chain(hAlign =>
    VerticalArbitrary.map(vAlign => ({...hAlign, ...vAlign})),
  )
