import {Arrays, Edges, Indented, Paths} from '#codec'
import {
  annotateDepthUnfold,
  annotateLevelLabelsUnfold,
  cropDepthUnfold,
  levelTreeUnfold,
} from '#ops'
import {byParentEffectUnfold, byParentUnfold} from '#tree'

export const unfolds = {
  annotateDepth: annotateDepthUnfold,
  annotateLevelLabels: annotateLevelLabelsUnfold,
  byParent: byParentUnfold,
  byParentEffect: byParentEffectUnfold,
  cropDepth: cropDepthUnfold,
  levelTree: levelTreeUnfold,
  paths: Paths.pathListUnfold,
  edges: Edges.decodeUnfold,
  arrays: Arrays.decodeUnfold,
  indented: Indented.decodeIndentedUnfold,
}
