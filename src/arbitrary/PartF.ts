import {
  mapHorizontalAlignments,
  mapVerticalAlignments,
  type Aligned,
  type HorizontallyAligned,
  type PartF,
  type VerticallyAligned,
} from '#draw'
import {
  columnF,
  ColumnF,
  EmptyF,
  emptyF,
  rowF,
  RowF,
  TextF,
  textF,
} from '#draw/partF'
import {tinyArray, tinyString} from 'effect-ts-laws'
import fc from 'fast-check'
import {hStrutsArbitrary, vStrutsArbitrary} from './Strut.js'

/**
 * @category arbitrary
 */
export const HorizontalArbitrary: fc.Arbitrary<HorizontallyAligned> =
  hStrutsArbitrary.chain(({left, right}) =>
    fc.record({
      hAlign: fc.oneof(...mapHorizontalAlignments(fc.constant)),
      left: fc.constant(left),
      right: fc.constant(right),
    }),
  )

/**
 * @category arbitrary
 */
export const VerticalArbitrary: fc.Arbitrary<VerticallyAligned> =
  vStrutsArbitrary.chain(({top, bottom}) =>
    fc.record({
      vAlign: fc.oneof(...mapVerticalAlignments(fc.constant)),
      top: fc.constant(top),
      bottom: fc.constant(bottom),
    }),
  )

/**
 * @category arbitrary
 */
export const AlignedArbitrary: fc.Arbitrary<Aligned> =
  HorizontalArbitrary.chain(hAlign =>
    VerticalArbitrary.map(vAlign => ({...hAlign, ...vAlign})),
  )

/**
 * An arbitrary for a filled rectangular block of text used for drawing trees.
 * @category internal
 */
export const getArbitrary = <A>(
  a: fc.Arbitrary<A>,
): fc.Arbitrary<PartF.PartF<A>> =>
  fc.oneof(
    EmptyPartFArbitrary,
    TextFPArtArbitrary,
    getColumnFArbitrary(a),
    getRowFArbitrary(a),
  )

/**
 * @category internal
 */
export const EmptyPartFArbitrary: fc.Arbitrary<EmptyF> = fc.constant(emptyF)

/**
 * @category internal
 */
export const TextFPArtArbitrary: fc.Arbitrary<TextF> = tinyString.map(textF)

/**
 * @category internal
 *
 */
export const getColumnFArbitrary = <A>(
  a: fc.Arbitrary<A>,
): fc.Arbitrary<ColumnF<A>> =>
  fc
    .tuple(tinyArray(a), HorizontalArbitrary)
    .map(([cells, horizontal]) => columnF(horizontal)(cells))

/**
 * @category internal
 */
export const getRowFArbitrary = <A>(
  a: fc.Arbitrary<A>,
): fc.Arbitrary<RowF<A>> =>
  fc
    .tuple(getColumnFArbitrary(a), VerticalArbitrary)
    .map(([{_tag: _, cells, ...horizontal}, vertical]) =>
      rowF({...horizontal, ...vertical})(cells),
    )
