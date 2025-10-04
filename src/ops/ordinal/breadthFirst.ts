import {type NonEmptyArray2, transpose} from '#Array'
import {Paths} from '#codec'
import {pipe} from '#Function'
import {map, type Tree} from '#tree'
import {Array, Number, Order} from '#util'
import {flow, Tuple} from 'effect'
import {flatten} from 'effect/Option'
import {zipUniqueOrdinal} from './zipUniqueOrdinal.js'

/**
 * @category internal
 */
export const annotateBreadthFirst =
  <A>(
    orderA: Order.Order<A>,
    start = 0,
  ): ((self: Tree<A>) => Tree<[A, number]>) =>
  self => {
    const [head, ...tail] = pipe(self, Paths.encode, transpose.nonEmpty)
    const zip = zipUniqueOrdinal(orderA)

    const paths = pipe(
      tail,
      Array.scan(zip(start)(head), ([, index], options) => zip(index)(options)),
      Array.map(Tuple.getFirst),
      transpose,
      Array.map(flow(Array.map(flatten), Array.getSomes)),
    ) as NonEmptyArray2<[A, number]>

    const order = Order.tuple(orderA, Number.Order) as Order.Order<[A, number]>

    return pipe(paths, Paths.decode(order))
  }

/**
 * @category internal
 */
export const replaceBreadthFirst =
  <A>(
    orderA: Order.Order<A>,
    start?: number,
  ): ((self: Tree<A>) => Tree<number>) =>
  self => {
    return pipe(self, annotateBreadthFirst(orderA, start), map(Tuple.getSecond))
  }
