import {Arrays, Edges, Indented, Paths} from '#codec'
import {
  annotateDepthUnfold,
  annotateLevelLabelsUnfold,
  cropDepthUnfold,
  levelTreeUnfold,
} from '#ops'
import {byParentUnfold} from '#tree'

/**
 * All unfolds in a single place.
 * @category unfold
 */
export const unfolds = {
  annotateDepth: annotateDepthUnfold,
  annotateLevelLabels: annotateLevelLabelsUnfold,
  arrays: Arrays.decodeUnfold,
  byParent: byParentUnfold,
  cropDepth: cropDepthUnfold,
  edges: Edges.decodeUnfold,
  indented: Indented.decodeIndentedUnfold,
  levelTree: levelTreeUnfold,
  paths: Paths.pathListUnfold,
}
