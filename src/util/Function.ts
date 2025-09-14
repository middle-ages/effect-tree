import type {HKT} from 'effect'
import type {LazyArg, FunctionN} from 'effect/Function'

export * from 'effect/Function'

/**
 * A function from a type `A` to itself.
 * Just like {@link EndoOf} except the type `A` is open.
 * @category util
 */
export interface EndoOf<A> {
  (a: A): A
}

/**
 * Just like {@link EndoOf} except the type `A` is open.
 * @category util
 */
export interface Endo {
  <A>(a: A): A
}
/**
 * Just like {@link Endo} except the endomorphism is between higher-kinded
 * types.
 * @category util
 */
export interface EndoK<F extends HKT.TypeLambda> {
  <A>(a: HKT.Kind<F, never, unknown, unknown, A>): typeof a
}

/**
 * ```
 * Unary<P, Q> ≡ (p: P) => R
 * ```
 * @category util
 */
export type Unary<Q = never, R = unknown> = FunctionN<[Q], R>

/**
 * The inverse of a unary function.
 *
 * ```ts
 * Dual<Unary<number,boolean>> ≡ Unary<boolean, number>
 * ```
 * @category util
 */
export interface Dual<F extends Unary> {
  (args: ReturnType<F>): Parameters<F>[0]
}

/**
 * Apply a nullary function.
 * @category util
 */
export const apply0 = <R>(f: () => R): R => f()

/**
 * Curry a binary function: `((a,b)→c) → (a→b→c)`.
 * @category util
 */
export const curry =
  <A, B, C>(f: (a: A, b: B) => C) =>
  (a: A) =>
  (b: B) =>
    f(a, b)

/**
 *  Uncurry a curried binary function: `a→b→c → ((a,b)→c)`.
 * @category util
 */
export const uncurry =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (a: A, b: B) =>
    f(a)(b)

/**
 * Flip argument order of a curried binary function: `a→b→c → (b→a→c)`.
 * @category util
 */
export const flipCurried =
  <A, B, C>(f: (a: A) => (b: B) => C): ((b: B) => (a: A) => C) =>
  b =>
  a =>
    f(a)(b)

/**
 * Do nothing, short for `no operator`.
 * @category util
 */
export const noop = (..._: unknown[]): void => {}

/**
 * Alias for `constant`.
 * @category util
 */
export const K =
  <T>(value: T): LazyArg<T> =>
  () =>
    value
