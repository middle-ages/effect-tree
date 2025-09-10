import {Equivalence} from 'effect'
import {getEquivalence as _getEquivalence} from 'effect/Tuple'

export * from 'effect/Tuple'

/** A tuple of arity-3 of type `A`. */
export type Tuple3<A> = readonly [A, A, A]

export const getEquivalence = Object.assign(_getEquivalence, {
  removeReadOnly: _getEquivalence as <
    T extends readonly Equivalence.Equivalence<any>[],
  >(
    ...isEquivalents: T
  ) => Equivalence.Equivalence<{
    [I in keyof T]: [T[I]] extends [Equivalence.Equivalence<infer A>]
      ? A
      : never
  }>,
})
