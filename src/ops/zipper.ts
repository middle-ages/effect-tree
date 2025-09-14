import * as Tree from from '#tree'
import {type EndoK} from '#util/Function'
import {Array, HKT} from 'effect'

export interface Zipper<A> {
  focus: Tree.Tree<A>
  path: Tree.Branch<A>[]
  lefts:Tree.Tree<A>[]
  rights:Tree.Tree<A>[]
}

/**
 * Type lambda for the `Zipper<A>` type.
 * `Kind<ZipperTypeLambda, never, unknown, unknown, A> = Zipper<A>`
 * @category folds
 */
export interface ZipperTypeLambda extends HKT.TypeLambda {
  readonly type: Zipper<this['Target']>
}

const onRoot = <A>(tree: Tree.Tree<A>): Zipper<A> => ({
  focus: tree,
  path: [],
  lefts: [],
  rights: [],
})

export const firstChild: EndoK<ZipperTypeLambda> = ({focus, path, lefts, rights})  => ({
  focus: Tree.firstChild(focus),
  path: Array.append(path, focus),
  lefts:[],
  rights:[Tree.sliceForest()],

}) 
