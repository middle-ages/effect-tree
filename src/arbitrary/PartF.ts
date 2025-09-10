import {nonEmptyArrayArbitrary} from './util.js'
import {pipe, Array} from 'effect'
import {unary, tinyArray, tinyString} from 'effect-ts-laws'
import fc from 'fast-check'
import {HorizontalArbitrary, VerticalArbitrary} from '#draw/part/align/data'
import {
  columnF,
  ColumnF,
  EmptyF,
  emptyF,
  RowF,
  text,
  TextF,
  textF,
  type PartF,
  type Text,
} from '#draw/part/partF/data'
import {
  type Themed,
  themes,
  type Theme,
  themeNames,
  type ThemeName,
} from '#draw'

/**
 * An arbitrary for a filled rectangular block of text used for drawing trees.
 * @category internal
 */
export const getArbitrary = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<PartF<A>> =>
  fc.oneof(
    EmptyPartFArbitrary,
    TextFPArtArbitrary,
    getColumnFArbitrary(a),
    getRowFArbitrary(a),
  )

/**
 * @category internal
 */
export const EmptyPartFArbitrary: fc.Arbitrary<EmptyF> = fc.constant(emptyF),
  TextFPArtArbitrary: fc.Arbitrary<TextF> = tinyString.map(textF),
  TextPartArbitrary: fc.Arbitrary<Text> = TextFPArtArbitrary.map(textF => ({
    unfixed: textF,
  }))

/**
 * @category internal
 */
export const getColumnFArbitrary = <A>(
  a: fc.Arbitrary<A>,
): fc.Arbitrary<ColumnF<A>> =>
  HorizontalArbitrary.chain(({hAlign}) =>
    TextPartArbitrary.chain(hStruct =>
      tinyArray(a).map(columnF(hAlign, hStruct)),
    ),
  )

/**
 * @category internal
 */
export const ArbitraryTheme: fc.Arbitrary<Theme> = fc.oneof(
  ...pipe(
    themeNames,
    Array.map((name: ThemeName) => fc.constant(themes[name])),
  ),
)

/**
 * @category internal
 */
export const ArbitraryThemed = <A>(
  a: fc.Arbitrary<A>,
): fc.Arbitrary<Themed<A>> => unary<Theme>()(a)

/**
 * @category internal
 */
export const getRowFArbitrary = <A>(
  a: fc.Arbitrary<A>,
): fc.Arbitrary<RowF<A>> =>
  fc.record({
    _tag: fc.constant('RowF'),
    hAlign: HorizontalArbitrary.map(a => a.hAlign),
    vAlign: VerticalArbitrary.map(a => a.vAlign),
    hStrut: TextPartArbitrary,
    vStrut: nonEmptyArrayArbitrary(tinyString).map(Array.map(text)),
    cells: tinyArray(a),
  })
