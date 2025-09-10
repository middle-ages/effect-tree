import {HashMap, Option, HKT, HashSet} from 'effect'
import type {NonEmptyArray} from 'effect/Array'

/** A tree edge is a pair of child and optional parent. */
export type TreeEdge<A> = [child: A, parent: Option.Option<A>]

/** A non-empty list of tree edges from a tree of the given type `A`. */
export type EdgeList<A> = NonEmptyArray<TreeEdge<A>>

/**
 * An indexed edge list. We index:
 *
 * 1. Child  node ⇒ parent node
 * 2. Parent node ⇒ list of child nodes
 * 3. Set of nodes with no parent node
 */
export interface EdgeMap<A> {
  /** Index of all tree nodes with no parent. */
  roots: HashSet.HashSet<A>

  /** Index of all tree nodes with parent ⇒ their parent. */
  toParent: HashMap.HashMap<A, A>

  /** Index of all parent tree nodes ⇒ their child tree nodes. */
  toChildren: HashMap.HashMap<A, A[]>
}
export type RootsMap<A> = EdgeMap<A>['roots']
export type ChildToParent<A> = EdgeMap<A>['toParent']
export type ParentToChildren<A> = EdgeMap<A>['toChildren']

/** `TreeEdge<?₁> = [?₁, Option<?₁>]` */
export interface TreeEdgeTypeLambda extends HKT.TypeLambda {
  readonly type: TreeEdge<this['Target']>
}

export interface EdgeListTypeLambda extends HKT.TypeLambda {
  readonly type: EdgeList<this['Target']>
}

export interface EdgeMapTypeLambda extends HKT.TypeLambda {
  readonly type: EdgeMap<this['Target']>
}
