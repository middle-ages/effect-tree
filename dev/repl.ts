import * as E from 'effect'
import * as S from '#util/String'
import * as T from '../index.js'

import {pipe, flow} from 'effect'
import {map, type Tree, drawTree} from '../index.js'

export const draw = (tree: Tree<number>): void => {
  console.debug(drawTree.number.unlines(tree))
}

Object.assign(globalThis, {
  draw,
  pipe,
  flow,
  map,
  drawTree,
  from: T.from,
  of: T.of,
  unlines: S.unlines,
  binaryTree: T.binaryTree,
  E,
  S,
  T,
  Codec: T.Codec,
})

console.log('Loaded.')
