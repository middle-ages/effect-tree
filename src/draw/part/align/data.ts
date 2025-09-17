import {orderToEqual} from '#util/Order'
import {Number, Order as OD, pipe} from 'effect'
import type {LazyArg} from 'effect/Function'
import fc from 'fast-check'

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
export interface VerticallyAligned {
  vAlign: VerticalAlignment
}

/**
 * @category drawing
 */
export interface HorizontallyAligned {
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
export const forVerticalAlignments = (
  f: (align: VerticalAlignment, n: number) => void,
) => {
  let i = 0
  for (const align of verticalAlignments) f(align, i++)
}

/**
 * @category drawing
 */
export const forHorizontalAlignments = (
  f: (align: HorizontalAlignment, n: number) => void,
) => {
  let i = 0
  for (const align of horizontalAlignments) f(align, i++)
}

/**
 * @category drawing
 */
export const mapVerticalAlignments = <A>(
  f: (align: VerticalAlignment, n: number) => A,
): [A, A, A] => [f('top', 0), f('middle', 1), f('bottom', 2)]

/**
 * @category drawing
 */
export const mapHorizontalAlignments = <A>(
  f: (align: HorizontalAlignment, n: number) => A,
): [A, A, A] => [f('left', 0), f('center', 1), f('right', 2)]

const alignGlyphs = {
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
export const showAlignment = (align: Alignment): string => alignGlyphs[align]

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

/**
 * @category drawing
 */
export const HorizontalArbitrary: fc.Arbitrary<HorizontallyAligned> = fc.oneof(
  ...mapHorizontalAlignments(hAlign => fc.constant({hAlign})),
)

/**
 * @category drawing
 */
export const VerticalArbitrary: fc.Arbitrary<VerticallyAligned> = fc.oneof(
  ...mapVerticalAlignments(vAlign => fc.constant({vAlign})),
)

/**
 * @category drawing
 */
export const AlignedArbitrary: fc.Arbitrary<Aligned> =
  HorizontalArbitrary.chain(hAlign =>
    VerticalArbitrary.map(vAlign => ({...hAlign, ...vAlign})),
  )
