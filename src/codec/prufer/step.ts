import {type EndoOf} from '#Function'
import {type Branch} from '#tree'
import {Array} from '#util'
import {Number, Predicate, Tuple, pipe} from 'effect'
import {decode} from './decoder.js'
import {encode} from './encoder.js'
import {
  codeCount,
  computeNodeCount,
  fromOrdinal,
  toOrdinal,
} from './enumerate.js'

/**
 * What is the 1st prüfer code for the given node count?
 * @category codec
 * @function
 */
export const getFirstCodeFor: (nodeCount: number) => number[] = nodeCount =>
  nodeCount < 3
    ? []
    : pipe(nodeCount, codeCount, count => Array.replicate(1, count))

/**
 * What is the last prüfer code for the given node count?
 * @category codec
 * @function
 */
export const getLastCodeFor: (n: number) => number[] = nodeCount =>
  nodeCount < 3
    ? []
    : pipe(nodeCount, codeCount, count => Array.replicate(nodeCount, count))

/**
 * Is this the first prüfer code for its node count?
 * @category codec
 * @function
 */
export const isFirstCode: Predicate.Predicate<number[]> = code =>
  Array.isNonEmptyArray(code) ? Array.every(code, n => n === 1) : true

/**
 * Is this the final prüfer code for its node count?
 * @category codec
 * @function
 */
export const isLastCode: Predicate.Predicate<number[]> = code => {
  if (Array.isNonEmptyArray(code)) {
    const nodeCount = computeNodeCount(code)
    return pipe(
      code,
      Array.every(n => n === nodeCount),
    )
  } else return true
}

/**
 * Get the _previous_ prüfer code for the given code. If the given code is the
 * first code for its node count, the last code of the _previous_ node count is
 * returned. When node count reaches 2, I.e.: code count is 0, we stop and
 * return the input unchanged.
 * @category codec
 * @function
 */
export const previousCode: EndoOf<number[]> = code =>
  Array.isNonEmptyArray(code)
    ? isFirstCode(code)
      ? code.length === 1
        ? []
        : getLastCodeFor(computeNodeCount(code) - 1)
      : pipe(code, withOrdinal(Tuple.mapFirst(n => n - 1n)))
    : []

/**
 * Get the _next_ prüfer code for the given code. If the given code is the final
 * code for its node count, the first code of the _next_ node count is returned.
 * @category codec
 * @function
 */
export const nextCode: EndoOf<number[]> = code =>
  isLastCode(code)
    ? getFirstCodeFor(computeNodeCount(code) + 1)
    : pipe(code, withOrdinal(Tuple.mapFirst(n => n + 1n)))

/**
 * Compute the previous Prüfer code from the given code with wrap-around.
 *
 * For example, the previous code of `1,1,1` (first code for 5 nodes) will be
 * `4,4` (last code for 4 nodes), and the previous code of `4,4` will be `4,3`.
 * @category codec
 * @function
 */
export const previousCodeWrap: EndoOf<number[]> = code =>
  Array.isNonEmptyArray(code)
    ? isFirstCode(code)
      ? pipe(code, computeNodeCount, getLastCodeFor)
      : previousCode(code)
    : []

/**
 * Compute the next Prüfer code from the given code with wrap-around.
 *
 * For example, the next code of `1,4` will be `2,1` and the next code of `4,4`
 * will be `1,1`.
 * @category codec
 * @function
 */
export const nextCodeWrap: EndoOf<number[]> = code =>
  isLastCode(code)
    ? pipe(code, computeNodeCount, getFirstCodeFor)
    : nextCode(code)

/**
 * Get the _previous_ numeric tree in the ordered set of numeric trees with
 * the same node count as the given tree. If the tree is the 1st in its
 * ordered set, we decrement node count and return the last tree in this
 * ordered set. The process stops when node count reaches 3, after which
 * the given tree is returned unchanged.
 * @category codec
 * @function
 */
export const previousTree: EndoOf<Branch<number>> = self =>
  pipe(self, encode(Number.Order), previousCode, decode)

/**
 * Get the _next_ numeric tree in the ordered set of numeric trees with
 * the same node count as the given tree. If the tree is the last in its
 * ordered set, we increment node count and return the first tree in this
 * ordered set.
 * @category codec
 * @function
 */
export const nextTree: EndoOf<Branch<number>> = self =>
  pipe(self, encode(Number.Order), nextCode, decode)

/**
 * Just like `previousTree` but when first tree is reached we wrap
 * around to the last tree with the same node count.
 * @category codec
 * @function
 */
export const previousTreeWrap: EndoOf<Branch<number>> = self =>
  pipe(self, encode(Number.Order), previousCodeWrap, decode)

/**
 * Just like `nextTree` but when last tree is reached we wrap
 * around to the first tree with the same node count.
 * @category codec
 * @function
 */
export const nextTreeWrap: EndoOf<Branch<number>> = self =>
  pipe(self, encode(Number.Order), nextCodeWrap, decode)

/**
 * Run a function over the `[ordinal, nodeCount]` pair of a code then convert it
 * back to the same encoding of ordinal/count pair.
 * @category codec
 * @function
 */
const withOrdinal =
  (f: (pair: [ordinal: bigint, nodeCount: number]) => typeof pair) =>
  (code: number[]): number[] => {
    const [n, nodeCount] = pipe(code, toOrdinal, f)
    return fromOrdinal(n, nodeCount)
  }
