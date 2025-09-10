import {type Branch, type Tree} from '#tree'
import {Array} from '#util'
import {identity, Number, type Order} from 'effect'
import type {Isomorphism} from 'effect-ts-laws/typeclass'
import type {NonEmptyArray} from 'effect/Array'
import {
  decode as decodeEdges,
  encode as encodeEdges,
  type EdgeList,
} from './edges.js'
import {
  decode as decodeIndented,
  encode as encodeIndented,
} from './indented/index.js'
import {decode as decodePaths, encode as encodePaths} from './paths.js'
import {decode as decodePrufer, encode as encodePrufer} from './prufer.js'

export type TreeIsomorphism<A, B> = Isomorphism.Isomorphism<Tree<A>, B>
export type BranchIsomorphism<A, B> = Isomorphism.Isomorphism<Branch<A>, B>

/** Encode/decode losslessly tree ↔ edge list. */
export const EdgeListIsomorphism = <A>(): TreeIsomorphism<A, EdgeList<A>> => ({
  to: encodeEdges,
  from: decodeEdges,
})

/** Encode/decode losslessly tree ↔ nested arrays. */
export const ArraysIsomorphism = <A>(
  order: Order.Order<A>,
): TreeIsomorphism<A, Array.NonEmptyArray2<A>> => ({
  to: encodePaths,
  from: decodePaths(order),
})

/** Encode/decode losslessly a numeric tree ↔ prüfer code. */
export const PruferIsomorphism: BranchIsomorphism<number, number[]> = {
  to: encodePrufer(Number.Order),
  from: decodePrufer,
}

/** Encode/decode losslessly a string tree ↔ indented tree. */
export const IndentedIsomorphism = (
  indent: number,
): TreeIsomorphism<string, NonEmptyArray<string>> => ({
  to: encodeIndented(indent)(identity),
  from: decodeIndented,
})
