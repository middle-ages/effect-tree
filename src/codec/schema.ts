import {type Branch, type Leaf, type Tree} from '#tree'
import type {BranchF, LeafF} from '#treeF'
import {Schema} from 'effect'

/**
 * Returns an Effect schema for a tree of `A` when given a schema for A.
 * @category codec
 * @function
 */
export const treeSchema = <A>(node: Schema.Schema<A>): Schema.Schema<Tree<A>> =>
  Schema.Union(
    Schema.suspend(() => branchSchema(node, treeSchema(node))),
    leafSchema(node),
  )

const branchSchema = <A>(
  node: Schema.Schema<A>,
  forest: Schema.Schema<Tree<A>>,
): Schema.Schema<Branch<A>> =>
  Schema.Struct({unfixed: branchFSchema(node, forest)})

const branchFSchema = <A, C>(
  node: Schema.Schema<A>,
  tree: Schema.Schema<C>,
): Schema.Schema<BranchF<A, C>> =>
  Schema.Struct({node, forest: Schema.NonEmptyArray(tree)})

const leafSchema = <A>(node: Schema.Schema<A>): Schema.Schema<Leaf<A>> =>
  Schema.Struct({unfixed: leafFSchema(node)})

const leafFSchema = <A>(node: Schema.Schema<A>): Schema.Schema<LeafF<A>> =>
  Schema.Struct({node})
