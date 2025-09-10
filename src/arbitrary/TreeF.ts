import {leafF, type TreeF, treeF} from '#treeF'
import * as fc from 'fast-check'
import {nonEmptyArrayArbitrary} from './util.js'

/**
 * An arbitrary {@link TreeF} built from the node and children arbitraries
 * given.
 */
export const getArbitrary =
  <A>(a: fc.Arbitrary<A>) =>
  <C>(c: fc.Arbitrary<C>): fc.Arbitrary<TreeF<A, C>> =>
    fc.oneof(
      a.map(leafF),
      nonEmptyArrayArbitrary(c).chain(cs => a.map(treeF(cs))),
    )
