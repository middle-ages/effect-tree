/**
 * Encode/decode trees to/from indented strings à la YAML.
 * @category codec
 */
export * as Indented from './codec/indented/index.js'

/**
 * Encode/decode trees to/from nested arrays à la s-expression.
 * @category codec
 */
export * as Arrays from './codec/arrays.js'

/**
 * Encode/decode trees to/from a list of edges.
 * @category codec
 */
export * as Edges from './codec/edges.js'

/**
 * Encode/decode trees to/from a list of leaf paths.
 * @category codec
 */
export * as Paths from './codec/paths.js'

/**
 * Encode/decode trees to/from prüfer codes and enumerate sorted numeric trees.
 * @category codec
 */
export * as Prufer from './codec/prufer.js'

/**
 * The codecs packaged as instances of the typeclass
 * `Isomorphism<Encoded, Decoded>`.
 * @category codec
 */
export * from './codec/Isomorphism.js'
