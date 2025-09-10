import {Equal, Equivalence, Order} from 'effect'

export * from 'effect/Order'

export const orderToEqual =
  <A>(o: Order.Order<A>): Equivalence.Equivalence<A> =>
  (self, that) =>
    Order.lessThanOrEqualTo(o)(self, that) && !Order.lessThan(o)(self, that)

orderToEqual.curried =
  <A>(o: Order.Order<A>) =>
  (that: A) =>
  (self: A) =>
    Order.lessThanOrEqualTo(o)(self, that) && !Order.lessThan(o)(self, that)

export const defaultComparator =
  <T>(): Equivalence.Equivalence<T> =>
  (self: T, that: T) =>
    Equal.equals(that)(self)
