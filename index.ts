/**
 * A library of operations on Rose trees.
 * @module effect-tree
 */
export * from './src/tree.js'
export * from './src/ops.js'
export * from './src/folds.js'
export * from './src/unfolds.js'

/**
 * Entry point for tree _codecs_.
 * @category codec
 */
export * as Codec from './src/codec.js'

/**
 * A data structure that encodes a left, a right, or both and can zip
 * associatively.
 * @category ops
 */
export * as These from './src/util/These.js'

/**
 * Arbitraries for tree types.
 * @category arbitrary
 */
export * as Arbitrary from './src/arbitrary.js'

/**
 * Draw trees to terminal glyphs.
 * @category drawing
 */
export * as Draw from './src/draw.js'

/**
 * The non-recursive version of {@link Tree} useful when folding.
 * @category fold
 */
export * as TreeF from './src/treeF.js'

/**
 * Efficiently navigate and modify trees.
 * @category zipper
 */
export * as Zipper from './src/zipper.js'

/**
 * Work with filesystem trees.
 * @category zipper
 */
export * as FileSystem from './src/fileSystem.js'

/**
 * @category drawing
 */
export {themedTree, drawTree} from './src/draw.js'

export {type Endo, type EndoK, type EndoOf} from './src/util/Function.js'
export {type NonEmptyArray2} from './src/util/Array.js'
