import {Equivalence as stringEquivalence, unwords} from '#util/String'
import {Equivalence as EQ, Record} from 'effect'
import type {LazyArg} from 'effect/Function'
import {StrutEquivalence, type HStruts, type VStruts} from '../struts.js'

/**
 * @category drawing
 */
export const horizontalAlignments = ['left', 'center', 'right'] as const

/**
 * @category drawing
 */
export const verticalAlignments = ['top', 'middle', 'bottom'] as const

/**
 * @category drawing
 */
export type HorizontalAlignment = (typeof horizontalAlignments)[number]

/**
 * @category drawing
 */
export type VerticalAlignment = (typeof verticalAlignments)[number]

/**
 * @category drawing
 */
export type Alignment = HorizontalAlignment | VerticalAlignment

/**
 * ```ts
 * {
 *   vAlign: VerticalAlignment
 *   top: VStrut
 *   bottom: VStrut
 * }
 * ```
 * @category drawing
 */
export interface VerticallyAligned extends VStruts {
  vAlign: VerticalAlignment
}

/**
 * ```ts
 * {
 *   hAlign: HorizontalAlignment
 *   left: HStrut
 *   right: HStrut
 * }
 * ```
 * @category drawing
 */
export interface HorizontallyAligned extends HStruts {
  hAlign: HorizontalAlignment
}

/**
 * @category drawing
 */
export interface Aligned extends HorizontallyAligned, VerticallyAligned {}

/**
 * @category drawing
 */
export const matchHorizontal =
  <R>(onLeft: LazyArg<R>, onCenter: LazyArg<R>, onRight: LazyArg<R>) =>
  (o: HorizontalAlignment): R =>
    o === 'left' ? onLeft() : o === 'center' ? onCenter() : onRight()

/**
 * @category drawing
 */
export const matchVertical =
  <R>(onTop: LazyArg<R>, onMiddle: LazyArg<R>, onBottom: LazyArg<R>) =>
  (o: VerticalAlignment): R =>
    o === 'top' ? onTop() : o === 'middle' ? onMiddle() : onBottom()

/**
 * @category drawing
 */
export const mapHorizontalAlignments = <A>(
  f: (align: HorizontalAlignment, n: number) => A,
): [A, A, A] => [f('left', 0), f('center', 1), f('right', 2)]

/**
 * @category drawing
 */
export const mapVerticalAlignments = <A>(
  f: (align: VerticalAlignment, n: number) => A,
): [A, A, A] => [f('top', 0), f('middle', 1), f('bottom', 2)]

/**
 * @category drawing
 */
export const forHorizontalAlignments = <R>(
  f: (align: HorizontalAlignment, n: number) => R,
) =>
  Record.fromEntries(
    mapHorizontalAlignments((hAlign, n) => [hAlign, f(hAlign, n)] as const),
  ) as Record<HorizontalAlignment, R>

/**
 * @category drawing
 */
export const forVerticalAlignments = <R>(
  f: (align: VerticalAlignment, n: number) => R,
) =>
  Record.fromEntries(
    mapVerticalAlignments((vAlign, n) => [vAlign, f(vAlign, n)] as const),
  ) as Record<VerticalAlignment, R>

const alignMarkers = {
  left: '⮄',
  center: '⮂',
  right: '⮆',
  top: '⮅',
  middle: '⮁',
  bottom: '⮇',
} satisfies Record<HorizontalAlignment | VerticalAlignment, string>

/**
 * @category drawing
 */
export const showAlignment = (align: Alignment): string => alignMarkers[align]

/**
 * @category drawing
 */
export const showAlignments = ({
  hAlign,
  vAlign,
}: {
  hAlign: HorizontalAlignment
  vAlign: VerticalAlignment
}): string => unwords.rest(showAlignment(hAlign), showAlignment(vAlign))

/**
 * Equivalence for {@link HorizontallyAligned}.
 * @category drawing
 */
export const HorizontalEquivalence: EQ.Equivalence<HorizontallyAligned> =
  EQ.struct({
    left: StrutEquivalence,
    right: StrutEquivalence,
    hAlign: stringEquivalence,
  })

/**
 * Equivalence for {@link VerticallyAligned}.
 * @category drawing
 */
export const VerticalEquivalence: EQ.Equivalence<VerticallyAligned> = EQ.struct(
  {
    top: StrutEquivalence,
    bottom: StrutEquivalence,
    vAlign: stringEquivalence,
  },
)

/**
 * Equivalence for {@link Aligned}.
 * @category drawing
 */
export const AlignedEquivalence: EQ.Equivalence<Aligned> = EQ.combine(
  HorizontalEquivalence as EQ.Equivalence<Aligned>,
  VerticalEquivalence as EQ.Equivalence<Aligned>,
)
