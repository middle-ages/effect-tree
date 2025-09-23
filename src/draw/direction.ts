/**
 * @category drawing
 */
export const axisDirections = {
  horizontal: ['left', 'right'],
  vertical: ['top', 'bottom'],
} as const

/**
 * Corners for the top of a box.
 * @category drawing
 */
export const topElbowDirections = ['topLeft', 'topRight'] as const

/**
 * Corners for the bottom of a box.
 * @category drawing
 */
export const bottomElbowsDirections = ['bottomRight', 'bottomLeft'] as const

/**
 * Elbows are named after the corner they appear at in a box border, which is
 * also the elbow direction is you view it as an arrow with a point.
 * @category drawing
 */
export const elbowDirections = [
  ...topElbowDirections,
  ...bottomElbowsDirections,
] as const

/**
 * @category drawing
 */
export const axis = ['horizontal', 'vertical'] as const

/**
 * @category drawing
 */
export const directions = ['top', 'right', 'bottom', 'left'] as const

/**
 * @category drawing
 */
export type Axis = (typeof axis)[number]

/**
 * @category drawing
 */
export type HorizontalDirection = 'left' | 'right'

/**
 * @category drawing
 */
export type VerticalDirection = 'top' | 'bottom'

/**
 * @category drawing
 */
export type Direction = (typeof directions)[number]

/**
 * @category drawing
 */
export type Directed<A> = Record<Direction, A>

/**
 * @category drawing
 */
export type AxisDirected<H, V> = Record<HorizontalDirection, H> &
  Record<VerticalDirection, V>

/**
 * @category drawing
 */
export type AxisString<A extends Axis> = A extends 'horizontal'
  ? string
  : string[]
