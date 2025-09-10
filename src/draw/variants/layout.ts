import {type Tree} from '#tree'
import {Array, flow, pipe, String} from '#util'
import {drawTree, type EnrichedDraw} from './index.js'

const _bottomUpString = (tree: Tree<string>): Array.NonEmptyArray<string> =>
  pipe(tree, drawTree, Array.reverse)

const _bottomUpNumeric = (tree: Tree<number>): Array.NonEmptyArray<string> =>
  pipe(tree, drawTree.number, Array.reverse)

export const drawBottomUpTree: EnrichedDraw = Object.assign(_bottomUpString, {
  unlines: flow(_bottomUpString, String.unlines),
  number: Object.assign(_bottomUpNumeric, {
    unlines: flow(_bottomUpNumeric, String.unlines),
  }),
})
