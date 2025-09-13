import {type Branch, treeAna, type TreeUnfolderK} from '#tree'
import * as TreeF from '#treeF'
import {Array, flow, pipe} from 'effect'
import {indexParents} from './map.js'
import {getMapChildren, setMapRoot} from './ops.js'
import type {EdgeList, EdgeMap, EdgeMapTypeLambda} from './types.js'

/**
 * Decode a level of a tree encoded as an edge list.
 * @category unfold
 */
export const decodeUnfold: TreeUnfolderK<EdgeMapTypeLambda> = map => {
  const [root, children] = getMapChildren(map)
  return pipe(
    children,
    Array.match({
      onEmpty: () => TreeF.leafF(root),
      onNonEmpty: flow(Array.map(setMapRoot(map)), TreeF.treeF.flip(root)),
    }),
  )
}

/** Decode an edge map into a tree. */
export const decodeMap = <A>(map: EdgeMap<A>) =>
  pipe(map, treeAna(decodeUnfold)) as Branch<A>

/** Decode an edge list into a tree. */
export const decode: <A>(edges: EdgeList<A>) => Branch<A> = flow(
  indexParents,
  decodeMap,
)
