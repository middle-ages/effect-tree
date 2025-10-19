import {
  Array,
  flow,
  HashMap,
  HashSet,
  identity,
  Option,
  pipe,
  Tuple,
} from 'effect'
import type {
  ChildToParent,
  EdgeList,
  EdgeMap,
  ParentToChildren,
  TreeEdge,
} from './types.js'

/**
 * Build a `EdgeMap` index from a non-empty list of tree edges.
 * @category internal
 * @function
 */
export const indexParents = <A>(edges: EdgeList<A>): EdgeMap<A> =>
  pipe(edges, Array.reduce(emptyEdgeMap(), addEdgeMap<A>))

// Add a previously unknown node and its optional parent to an
// `EdgeMap` map.
const addEdgeMap = <A>(index: EdgeMap<A>, edge: TreeEdge<A>): EdgeMap<A> =>
  pipe(
    [edge, index] as EdgeAndMap<A>,
    updateRoots,
    updateChildToParent,
    updateParentToChildren,
    Tuple.getSecond,
  )

type EdgeAndMap<A> = [TreeEdge<A>, EdgeMap<A>]
type EdgeAndMapEndo = <A>(edgeAndMap: EdgeAndMap<A>) => EdgeAndMap<A>

// Update the roots map of a `EdgeMap` index with a new edge.
const updateRoots: EdgeAndMapEndo = ([[child, parent], {roots, ...rest}]) => [
  [child, parent],
  {
    ...rest,
    roots: pipe(
      roots,
      pipe(
        parent,
        Option.match({
          onNone: () => HashSet.add,
          onSome: () => HashSet.remove,
        }),
      )(child),
    ),
  },
]

// Update the child to parent map of a `EdgeMap` index with a new edge.
const updateChildToParent: EdgeAndMapEndo = ([
  [child, parent],
  {toParent, ...rest},
]) => [
  [child, parent],
  {
    ...rest,
    toParent: pipe(
      toParent,
      pipe(
        parent,
        Option.match({
          onNone: () => identity<ChildToParent<typeof child>>,
          onSome: parent => HashMap.set(child, parent),
        }),
      ),
    ),
  },
]

// Update the parent to children map of an `EdgeMap` index with a new edge.
const updateParentToChildren: EdgeAndMapEndo = ([
  [child, parent],
  {toChildren, ...rest},
]) => [
  [child, parent],
  {
    ...rest,
    toChildren: pipe(
      parent,
      Option.match({
        onNone: () => toChildren,
        onSome: addParent(toChildren, child),
      }),
    ),
  },
]

const addParent =
  <A>(
    toChildren: ParentToChildren<A>,
    child: A,
  ): ((a: A) => ParentToChildren<A>) =>
  parent =>
    pipe(
      toChildren,
      HashMap.modifyAt(
        parent,
        flow(
          Option.match({onNone: () => [child], onSome: Array.append(child)}),
          Option.some,
        ),
      ),
    )

// Create a new `EdgeMap` index.
const emptyEdgeMap = () => ({
  roots: HashSet.empty(),
  toParent: HashMap.empty(),
  toChildren: HashMap.empty(),
})
