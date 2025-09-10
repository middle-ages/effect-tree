import type {Array, HKT} from 'effect'
import type {TreeTypeLambda, Tree} from '../tree/types.js'
import type {ComposeTypeLambda} from 'effect-ts-laws'

/** Type lambda for `[T, Tree<A>]` */
export interface WithTreeLambda<T> extends HKT.TypeLambda {
  readonly type: [T, Tree<this['Target']>]
}

export interface NonEmptyArrayTypeLambda extends HKT.TypeLambda {
  readonly type: Array.NonEmptyArray<this['Target']>
}

export type NonEmptyArray2TypeLambda = ComposeTypeLambda<
  NonEmptyArrayTypeLambda,
  NonEmptyArrayTypeLambda
>

/** A type lambda for `Array.NonEmptyArray<Tree<?>>`. */
export type ForestTypeLambda = ComposeTypeLambda<
  NonEmptyArrayTypeLambda,
  TreeTypeLambda
>
