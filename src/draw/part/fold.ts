import {cata, type Algebra} from 'effect-ts-folds'
import {Traversable, type PartFTypeLambda} from '../partF.js'
import {type Part} from './types.js'

/**
 * A function of the type `PartF<A> ⇒ A`.
 * @category drawing
 */
export type PartFolder<A> = Algebra<PartFTypeLambda, A>

/**
 * @category drawing
 * @function
 */
export const partCata = <A>(folder: PartFolder<A>): ((part: Part) => A) =>
  cata(Traversable)(folder)
