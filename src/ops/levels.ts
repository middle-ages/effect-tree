import {
  byParentUnfold,
  fixTree,
  getNode,
  match,
  treeAna,
  treeCata,
  type Tree,
  type TreeFold,
  type TreeFolder,
  type TreeUnfold,
  type TreeUnfolder,
} from '#tree'
import * as TreeF from '#treeF'
import {transpose, type NonEmptyArray, type NonEmptyArray2} from '#util/Array'
import {type EndoOf} from '#util/Function'
import {pair} from '#util/Pair'
import {Array, flow, pipe} from 'effect'

/** Settings for the `unfolds.levelTree` unfold. */
export interface LevelTreeSettings {
  /** Requested depth of unfolded tree. */
  depth: number

  /**
   * Function to be run at each node to determine its child count, also called
   * _degree_. The function will be called with the node _depth_.
   */
  degree?: (depth: number) => number
}

/** Unfold a single layer of a numeric level tree. */
export const levelTreeUnfold = ({
  depth,
  degree = () => 1,
}: LevelTreeSettings): TreeUnfolder<number, number> =>
  byParentUnfold((n: number): number[] =>
    n >= depth ? [] : Array.replicate(n + 1, degree(n)),
  )

/** Annotate nodes at a tree level with their depth. */
export const annotateDepthUnfold = <A>([tree, previousDepth]: [
  Tree<A>,
  number,
]): TreeF.TreeF<readonly [A, number], [Tree<A>, number]> => {
  const depth = previousDepth + 1
  return pipe(
    tree,
    match({
      onLeaf: flow(pair.withSecond(depth), TreeF.leafF),
      onBranch: (value, nodes) =>
        TreeF.branchF(
          [value, depth] as const,
          pipe(nodes, Array.map(pair.withSecond(depth))),
        ),
    }),
  )
}

/** Group a level of the tree by _depth_. */
export const levelsFold = <A>(
  self: TreeF.TreeF<A, NonEmptyArray2<A>>,
): NonEmptyArray2<A> =>
  pipe(
    self,
    TreeF.match({
      onLeaf: node => [[node]],
      onBranch: (node, forest): NonEmptyArray2<A> => {
        return [
          [node],
          ...(pipe(
            forest as NonEmptyArray<NonEmptyArray2<A>>,
            transpose,
            Array.map(flow(Array.getSomes, Array.flatten)),
          ) as NonEmptyArray2<A>),
        ]
      },
    }),
  )

/** Label a string tree with a level index. */
export const annotateLevelLabelsUnfold: TreeUnfolder<
  string,
  [string, Tree<string>]
> = ([prefix, self]: [string, Tree<string>]): TreeF.TreeF<
  string,
  [string, Tree<string>]
> => {
  const prefixValue: EndoOf<string> = flow(
      pair.withFirst(prefix),
      Array.join(' '),
    ),
    prefixLeaf = flow(prefixValue, TreeF.leafF),
    prefixBranch = (node: Tree<string>, i: number): [string, Tree<string>] => [
      prefix + (i + 1).toString() + '.',
      node,
    ]

  return pipe(
    self,
    match({
      onLeaf: prefixLeaf,
      onBranch: (node, forest) =>
        TreeF.branchF(prefixValue(node), Array.map(forest, prefixBranch)),
    }),
  )
}

/** Crop all nodes from a tree that are below the given depth. */
export const cropDepthUnfold = <A>([depth, self]: readonly [
  number,
  Tree<A>,
]): TreeF.TreeF<A, readonly [number, Tree<A>]> =>
  depth === 1
    ? pipe(self, getNode, TreeF.leafF)
    : pipe(
        self,
        match<A, TreeF.TreeF<A, [number, Tree<A>]>>({
          onLeaf: TreeF.leafF,
          onBranch: (node, forest) =>
            TreeF.branchF(
              node,
              pipe(forest, Array.map(pair.withFirst(depth - 1))),
            ),
        }),
      )

/** Returns tree nodes grouped by level. */
export const levels: <A>(self: Tree<A>) => NonEmptyArray2<A> = self =>
  pipe(self, treeCata(levelsFold))

/** Unfold a perfectly balanced tree from the given settings. */
export const unfoldLevelTree: (
  settings: LevelTreeSettings,
) => TreeUnfold<number, number> = settings =>
  pipe(settings, levelTreeUnfold, treeAna)

/** Returns tree nodes paired with their hop count from root. */
export const annotateDepth = <A>(self: Tree<A>): Tree<readonly [A, number]> =>
  treeAna(annotateDepthUnfold<A>)([self, 0])

/**
 * Annotate a string tree with label that indicate the node depth and index
 * in their parent node.
 */
export const addLevelLabels: (self: Tree<string>) => Tree<string> = tree =>
  treeAna(annotateLevelLabelsUnfold)(['1.', tree])

/**
 * Crop all nodes from a tree that are deeper than the given depth. For example:
 *
 * ```ts
 * import {leaf, branch, cropDepth} from 'effect-ts-tree'
 *
 * const depth4: Tree<string> = branch(1, [branch(2, [branch(3, [leaf(4)])])]])
 *
 * const depth2: Tree<string> = pipe(depth4, cropDepth(2))
 * // depth2 =  branch(1, [leaf(2)])
 * ```
 */
export const cropDepth =
  (depth: number) =>
  <A>(self: Tree<A>): Tree<A> =>
    pipe(self, pair.withFirst(depth), treeAna(cropDepthUnfold<A>))

export const growLeavesFold =
  <A>(grow: TreeUnfold<A, A>): TreeFolder<A, Tree<A>> =>
  self =>
    TreeF.isBranch(self) ? fixTree(self) : grow(TreeF.getNode(self))

/**
 * Grows the tree at its leaves.
 *
 * Given a function of type `(a: A) ⇒ Tree<A>` replacing a value of type `A`
 * with a `Tree<A>`, grow the tree by running all leaves through this function
 * and replacing them with its results.
 */
export const growLeaves = <A>(grow: TreeUnfold<A, A>): TreeFold<A, Tree<A>> =>
  pipe(grow, growLeavesFold, treeCata)
