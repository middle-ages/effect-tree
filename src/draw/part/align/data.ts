import {orderToEqual} from '#util/Order'
import {Number, Order as OD, pipe} from 'effect'
import type {LazyArg} from 'effect/Function'
import fc from 'fast-check'

export const horizontalAlignments = ['left', 'center', 'right'] as const
export const verticalAlignments = ['top', 'middle', 'bottom'] as const

export type HorizontalAlignment = (typeof horizontalAlignments)[number]
export type VerticalAlignment = (typeof verticalAlignments)[number]
export type Alignment = HorizontalAlignment | VerticalAlignment

export interface VerticallyAligned {
  vAlign: VerticalAlignment
}

export interface HorizontallyAligned {
  hAlign: HorizontalAlignment
}

export interface Aligned extends HorizontallyAligned, VerticallyAligned {}

export const matchHorizontal =
    <R>(onLeft: LazyArg<R>, onCenter: LazyArg<R>, onRight: LazyArg<R>) =>
    (o: HorizontalAlignment): R =>
      o === 'left' ? onLeft() : o === 'center' ? onCenter() : onRight(),
  matchVertical =
    <R>(onTop: LazyArg<R>, onMiddle: LazyArg<R>, onBottom: LazyArg<R>) =>
    (o: VerticalAlignment): R =>
      o === 'top' ? onTop() : o === 'middle' ? onMiddle() : onBottom()

export const forVerticalAlignments = (
    f: (align: VerticalAlignment, n: number) => void,
  ) => {
    let i = 0
    for (const align of verticalAlignments) f(align, i++)
  },
  forHorizontalAlignments = (
    f: (align: HorizontalAlignment, n: number) => void,
  ) => {
    let i = 0
    for (const align of horizontalAlignments) f(align, i++)
  }

export const mapVerticalAlignments = <A>(
    f: (align: VerticalAlignment, n: number) => A,
  ): [A, A, A] => [f('top', 0), f('middle', 1), f('bottom', 2)],
  mapHorizontalAlignments = <A>(
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

export const showAlignment = (align: Alignment): string => alignGlyphs[align]

const [horizontalIndexes, verticalIndexes] = [
  {left: 1, center: 2, right: 3},
  {top: 1, middle: 2, bottom: 3},
] as const

export const [HorizontalOrder, VerticalOrder]: [
    OD.Order<HorizontallyAligned>,
    OD.Order<VerticallyAligned>,
  ] = [
    pipe(
      Number.Order,
      OD.mapInput(
        (self: HorizontallyAligned) => horizontalIndexes[self.hAlign],
      ),
    ),
    pipe(
      Number.Order,
      OD.mapInput((self: VerticallyAligned) => verticalIndexes[self.vAlign]),
    ),
  ],
  AlignedOrder: OD.Order<Aligned> = OD.combine<Aligned>(
    HorizontalOrder,
    VerticalOrder,
  )

export const [HorizontalEquivalence, VerticalEquivalence, AlignedEquivalence] =
  [
    orderToEqual(HorizontalOrder),
    orderToEqual(VerticalOrder),
    orderToEqual(AlignedOrder),
  ]

export const [HorizontalArbitrary, VerticalArbitrary]: [
  fc.Arbitrary<HorizontallyAligned>,
  fc.Arbitrary<VerticallyAligned>,
] = [
  fc.oneof(...mapHorizontalAlignments(hAlign => fc.constant({hAlign}))),
  fc.oneof(...mapVerticalAlignments(vAlign => fc.constant({vAlign}))),
]

export const AlignedArbitrary: fc.Arbitrary<Aligned> =
  HorizontalArbitrary.chain(hAlign =>
    VerticalArbitrary.map(vAlign => ({...hAlign, ...vAlign})),
  )
