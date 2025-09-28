import {Equivalence as stringEquivalence, unwords} from '#String'
import {Equivalence as EQ, Record} from 'effect'
import type {LazyArg} from 'effect/Function'
import {
  HStrutEquivalence,
  VStrutEquivalence,
  type HStruts,
  type VStruts,
} from '../struts.js'

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
 * @function
 */
export const matchHorizontal =
  <R>(onLeft: LazyArg<R>, onCenter: LazyArg<R>, onRight: LazyArg<R>) =>
  (o: HorizontalAlignment): R =>
    o === 'left' ? onLeft() : o === 'center' ? onCenter() : onRight()

/**
 * @category drawing
 * @function
 */
export const matchVertical =
  <R>(onTop: LazyArg<R>, onMiddle: LazyArg<R>, onBottom: LazyArg<R>) =>
  (o: VerticalAlignment): R =>
    o === 'top' ? onTop() : o === 'middle' ? onMiddle() : onBottom()

/**
 * @category drawing
 * @function
 */
export const mapHorizontalAlignments = <A>(
  f: (align: HorizontalAlignment, n: number) => A,
): [A, A, A] => [f('left', 0), f('center', 1), f('right', 2)]

/**
 * @category drawing
 * @function
 */
export const mapVerticalAlignments = <A>(
  f: (align: VerticalAlignment, n: number) => A,
): [A, A, A] => [f('top', 0), f('middle', 1), f('bottom', 2)]

/**
 * @category drawing
 * @function
 */
export const forHorizontalAlignments = <R>(
  f: (align: HorizontalAlignment, n: number) => R,
) =>
  Record.fromEntries(
    mapHorizontalAlignments((hAlign, n) => [hAlign, f(hAlign, n)] as const),
  ) as Record<HorizontalAlignment, R>

/**
 * @category drawing
 * @function
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
 * @function
 */
export const showAlignment = (
  align: HorizontalAlignment | VerticalAlignment,
): string => alignMarkers[align]

/**
 * @category drawing
 * @function
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
 * @function
 */
export const HorizontalEquivalence: EQ.Equivalence<HorizontallyAligned> =
  EQ.struct({
    left: HStrutEquivalence,
    right: HStrutEquivalence,
    hAlign: stringEquivalence,
  })

/**
 * Equivalence for {@link VerticallyAligned}.
 * @category drawing
 * @function
 */
export const VerticalEquivalence: EQ.Equivalence<VerticallyAligned> = EQ.struct(
  {
    top: VStrutEquivalence,
    bottom: VStrutEquivalence,
    vAlign: stringEquivalence,
  },
)

/**
 * Equivalence for {@link Aligned}.
 * @category drawing
 * @function
 */
export const AlignedEquivalence: EQ.Equivalence<Aligned> = EQ.combine(
  HorizontalEquivalence as EQ.Equivalence<Aligned>,
  VerticalEquivalence as EQ.Equivalence<Aligned>,
)
