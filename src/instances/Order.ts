import {Array, Function, K, pipe, type Order} from '#util'
import {Effect, identity} from 'effect'
import {match} from '../tree/index.js'
import type {Tree} from '../tree/types.js'

/**
 * Build an order for {@link Tree} from and order of its underlying type.
 * @example
 * import {getOrder, from, of} from 'effect-tree'
 * import {Number, Array, pipe} from 'effect'
 *
 * const t1 = of(1)
 * const t2 = of(2)
 * const t3 = from(1, of(2))
 * const t4 = from(1, of(1), of(2))
 * const t5 = from(1, of(2), of(1))
 * const t6 = from(2, of(1))
 * const t7 = from(2, of(1), of(2))
 *
 * const sort = pipe(Number.Order, getOrder, Array.sortBy)
 *
 * expect(
 *   sort(
 *     [t7, t6, t5, t4, t3, t2, t1]
 *   )
 * ).toEqual(
 *     [t1, t2, t3, t4, t5, t6, t7]
 * )
 * @category instances
 * @function
 */
export const getOrder =
  <A>(orderA: Order.Order<A>): Order.Order<Tree<A>> =>
  (self: Tree<A>, that: Tree<A>) =>
    pipe(
      getOrderEffect(orderA)(self, that),
      Effect.match({
        onSuccess: K<0>(0),
        onFailure: identity<-1 | 1>,
      }),
      Effect.runSync,
    )

// We use effect _success_ to encode equality and effect _failure_ of `-1 | 1`
// to encode greater than/less than.
const getOrderEffect =
  <A>(orderA: Order.Order<A>) =>
  (self: Tree<A>, that: Tree<A>): Effect.Effect<void, -1 | 1> => {
    const order = Function.tupled(getOrderEffect(orderA))

    return pipe(
      self,
      match({
        onLeaf: selfValue =>
          pipe(
            that,
            match({
              onLeaf: thatValue => {
                const valueOrder = orderA(selfValue, thatValue)
                return valueOrder === 0
                  ? Effect.succeed(void {})
                  : Effect.fail(valueOrder)
              },
              onBranch: K(Effect.fail(-1)),
            }),
          ),
        onBranch: (selfValue, selfForest) =>
          pipe(
            that,
            match({
              onLeaf: K(Effect.fail(1)),
              onBranch: (thatValue, thatForest) => {
                const valueOrder = orderA(selfValue, thatValue)
                if (valueOrder !== 0) {
                  return Effect.fail(valueOrder)
                }

                if (selfForest.length < thatForest.length) {
                  return Effect.fail(-1)
                } else if (selfForest.length > thatForest.length) {
                  return Effect.fail(1)
                }

                return Effect.suspend(() =>
                  pipe(
                    selfForest,
                    Array.zip(thatForest),
                    Effect.forEach(order),
                    Effect.map(K(void {})),
                  ),
                )
              },
            }),
          ),
      }),
    )
  }
