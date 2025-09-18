import {orderToEqual} from '#util/Order'
import {unwords} from '#util/String'
import {Number, Order as OD, pipe, Record} from 'effect'
import type {LazyArg} from 'effect/Function'
import type {HasHStrut, HasVStrut} from '../struts.js'

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
 * @category drawing
 */
export interface VerticallyAligned extends HasVStrut {
  vAlign: VerticalAlignment
}

/**
 * @category drawing
 */
export interface HorizontallyAligned extends HasHStrut {
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

const [horizontalIndexes, verticalIndexes] = [
  {left: 1, center: 2, right: 3},
  {top: 1, middle: 2, bottom: 3},
] as const

/**
 * @category drawing
 */
export const HorizontalOrder: OD.Order<HorizontallyAligned> = pipe(
  Number.Order,
  OD.mapInput((self: HorizontallyAligned) => horizontalIndexes[self.hAlign]),
)

/**
 * @category drawing
 */
export const VerticalOrder: OD.Order<VerticallyAligned> = pipe(
  Number.Order,
  OD.mapInput((self: VerticallyAligned) => verticalIndexes[self.vAlign]),
)

/**
 * @category drawing
 */
export const AlignedOrder: OD.Order<Aligned> = OD.combine<Aligned>(
  HorizontalOrder,
  VerticalOrder,
)

/**
 * @category drawing
 */
export const HorizontalEquivalence = orderToEqual(HorizontalOrder)

/**
 * @category drawing
 */
export const VerticalEquivalence = orderToEqual(VerticalOrder)

/**
 * @category drawing
 */
export const AlignedEquivalence = orderToEqual(AlignedOrder)
