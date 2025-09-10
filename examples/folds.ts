import {Prufer} from '#codec'
import {drawTree} from '#draw'
import {
  annotateFolder,
  leaf,
  map,
  replaceFolder,
  structTreeFolds,
  treeCata,
  treeHylo,
  zipTreeFolds,
  type Tree,
  type TreeFolder,
  type TreeFolderOf,
  tree,
  unfixTree,
  treePara,
  length,
  getForest,
} from '#tree'
import * as TreeF from '#treeF'
import {number, unlines, type Pair} from '#util'
import {Array, Number, pipe, Tuple} from 'effect'
import {
  algebraToCVAlgebra,
  histo,
  pairMap,
  struct,
  zipFolds,
  type Cofree,
  type CVAlgebra,
  type RAlgebra,
} from 'effect-ts-folds'
import {flow, constant as K} from 'effect/Function'
import {annotateDepthUnfold, degreeFold, levelsFold} from '#ops'
import type {NonEmptyArray} from 'effect/Array'

const log = console.log
const showNPair = (pair: Pair<number>): string => pair.map(number).join(':')

const [showS, showN] = [
  (self: Tree<string>) => {
    pipe(self, drawTree, unlines, console.debug)
  },
  (self: Tree<number>) => {
    pipe(self, map(number), showS)
  },
]

const self = pipe(Prufer.getNthTree(16, 4e14), map(K(0)))
showN(self)

const runFolder = <A>(folder: TreeFolder<number, A>): A =>
  pipe(self, treeCata(folder))

const showFold = <A>(
  name: string,
  folder: TreeFolder<number, A>,
  show: (a: A) => string,
) => {
  log(`“${name}” fold: ${pipe(folder, runFolder, show)}`)

  log('replaced:')
  pipe(folder, replaceFolder, runFolder, map(show), showS)
  log('annotated:')
  pipe(
    folder,
    annotateFolder,
    runFolder,
    map(([n, a]) => [n.toString(), show(a)].join(':')),
    showS,
  )
}

const showFoldN = (name: string, folder: TreeFolder<number, number>) => {
  showFold(name, folder, number)
}

const heightFold: TreeFolderOf<number> = TreeF.match({
  onLeaf: K(1),
  onBranch: (_, forest) => Math.max(...forest) + 1,
})

const descendentCountFold: TreeFolderOf<number> = TreeF.match({
  onLeaf: K(1),
  onBranch: (_, forest) => Number.sumAll(forest) + 1,
})

showFoldN('height', heightFold)

showFoldN('descendentCount', descendentCountFold)

showFold(
  'height ¥ descendentCount',
  zipTreeFolds(heightFold, descendentCountFold),
  ([n, m]) => [n.toString(), m.toString()].join(':'),
)

pipe(
  [self, 0] as [Tree<number>, 0],
  treeHylo(
    annotateDepthUnfold,
    annotateFolder(zipTreeFolds(heightFold, descendentCountFold)),
  ),
  map(flow(pairMap(showNPair), Array.join(';'))),
  showS,
)

type Result = {
  height: number
  descendants: number
}

const structFold: TreeFolderOf<Result> = structTreeFolds({
  height: heightFold,
  descendants: descendentCountFold,
})

const folded: Result = pipe(self, treeCata(structFold))

console.table(folded)

const cvFolded: <A>(
  fa: TreeF.TreeF<
    A,
    Cofree<TreeF.TreeFTypeLambda, Result, A, unknown, unknown>
  >,
) => Result = algebraToCVAlgebra(TreeF.Traversable)(structFold)

const cv = pipe(self, histo(TreeF.Traversable)(cvFolded))
console.log(cv)

// >
const rFolder: RAlgebra<TreeF.TreeFTypeLambda, Tree<string>, string> = (
  fa: TreeF.TreeF<string, [Tree<string>, Tree<string>]>,
): Tree<string> =>
  pipe(
    fa,
    TreeF.match({
      onLeaf: node => leaf(node),
      onBranch: (node, forest) => {
        return tree(
          node,
          pipe(
            forest,
            Array.map(([previous, current]) => {
              if (length(current) === 1) {
                const [head]: Tree<string>[] = getForest(current)
                if (head === undefined) throw new Error('no head')
                return head
              } else {
                return current
              }
            }),
          ),
        )
        //
      },
    }),
  )

const x = pipe(self, map(number), treePara(rFolder))

showN(self)
showS(x)

/*
RAlgebra
(fa: TreeF<A, [Tree<A>, A]>)  => A
(fa: F<[Fix<F, E, R, I>, A], E, R, I>) ⇒ A

(fa: F<Cofree<F, A, E, R, I>, E, R, I>) ⇒ A

Cofree<F, A> ≡ [A, F<Cofree<F, A>>]



    levels: levelsFold,
<E = unknown, R = unknown, I = never>(self: Tree<E>) => ReturnTypes<TreeF.TreeFTypeLambda, {
    heightFold: TreeFolderOf<number>;
}, E, R, I>







*/
//const computeRow = (n: number, previous: number[]): number[] =>
//    levels: levelsFold,
//    degree: degreeFold,
//    height: heightFold,
//    descendentCount: descendentCountFold,
//  pipe(
//    Array.range(0, n),
//    Array.map(k =>
//      k <= 0 || k >= n ? 1 : (previous[k - 1] ?? 0) + (previous[k] ?? 0),
//    ),
//  )
//
//const computeRows = (depth: number) =>
//  pipe(
//    Array.range(0, depth),
//    Array.reduce([] as number[][], (previous, n) => [
//      ...previous,
//      computeRow(n, previous.at(-1) ?? []),
//    ]),
//  )
//
//console.table(computeRows(3))
//console.table(computeRows(4))
//console.table(computeRows(5))

//
//const l1: TreeArray<'x'> = ['x', ['x', 'x']]
//const l2: TreeArray<'x'> = ['x', ['x', ['x', [l1, 'x', l1]]]]
//const l3: TreeArray<'x'> = ['x', ['x', ['x', [l1, l2, 'x']]]]
//const l4: TreeArray<'x'> = ['x', [l3, l2, l1, 'x', ['x', [l3]]]]
//
//const self: Tree<'x'> = Arrays.decode(l4)
//
//show(self as Tree<string>)
//
//const z = asOrdinalTree(self)
//
//showN(z)

//
//class Counter {
//  readonly getNext: Effect.Effect<number>
//  constructor(private readonly ref: Ref.Ref<number>) {
//    this.getNext = pipe(
//      this.ref,
//      Ref.get,
//      Effect.tap(() => Ref.update(this.ref, increment)),
//    )
//  }
//}
//

/*

      // (f: TreeEffectFold<number, Tree<number>>): Effect.Effect<Tree<number>> =>
      //  f(self),
      x  => 

  //  Effect.flatMap(counter => pipe(self, treeCataE<number, Tree<number>>(indexEffectFold(counter)))),
const initCount = (initialize: number): Effect.Effect<Counter> =>
  pipe(initialize, Ref.make, Effect.andThen(buildCounter))
effect tree number

        (self: UnfixedTree<number>): Effect.Effect<UnfixedTree<number>> =>(self)
console.log('done')
  const a = yield* counter.getNext
  const b = yield* counter.getNext
  const c = yield* counter.getNext
  console.log(
    `This counter has a value of ${a.toString()}, ${b.toString()}, ${c.toString()}.`,
  )

//const mapped = pipe(self, mapE(n  => ))

export const incFold: TreeFolder<number, number> = (
  fa: TreeF<number, number>,
) => pipe(fa, getNodeF, increment)

const ordinalFold: DistLeft<TreeFTypeLambda, number, number, number> = (
  self: TreeF<number, [number, number]>,
) => {
  return undefined as unknown as number
}

const foo = zygo(Traversable)(ordinalFold, incFold)

const self2 = foo(self)

console.log(self2)

//const scanFold = show(self)

TreeFolder<A,B> = (self: TreeF<A, B>)  => B

DistLeft<A,B,C> = (self: TreeF<C, [A, B]>)  => A


const aaa = (a: TreeFolder<number, boolean>) => {
  const xx = a(undefined as unknown as TreeF.TreeF<wbumber, boolean>)
}

dist left
 * `(fa: F<[A, B], E, R, I>) ⇒ A`.
 * `(fa: F<Cofree<F, A, E, R, I>, E, R, I>) ⇒ A`.
const foldId: TreeFolder<string, Tree<number>> = (
  self: TreeF<string, number>,
): Tree<number> => {
  const res = pipe(
    self,
    matchF({
      onLeaf: (node: number): Tree<number> => leaf(node),
      onBranch: (
        node: number,
        forest: NonEmptyArray<Tree<number>>,
      ): Tree<number> =>
        tree(
          node,
          pipe(
            forest,
            Array.map((child: Tree<number>, index: number) =>
              pipe(
                child,
                modNode(n => n + index),
              ),
            ),
          ),
        ),
    }),
  )
  return res
  //  return undefined as unknown as Tree<number>
}

const foldedId = pipe(self, treeCata(foldId))

show(foldedId)


TreeFolder<A, B> ≡ TreeF.TreeF<A, B> => B



const unfolder: TreeProductFolder<string, number> = (
  fa: TreeF.TreeF<string, [Tree<string>, number]>,
) => {
  return undefined as unknown as number
}


let i = 0
const mapped = map(self, () => (i++).toString())

const ff: Tree<[number, string]> = pipe(self, map(pairWithFirst(0)))
const ff2 = pipe(ff, treeAna(numberUnfold), map(number))

console.debug(unlines(drawTree(ff2)))


export const numberUnfold: TreeUnfolder<number, Tree<[number, string]>> = (
  self: Tree<[number, string]>,
) => {
  const res = pipe(
    self,
    match({
      onLeaf: ([i]): TreeF.TreeF<number, Tree<[number, string]>> =>
        TreeF.leafF(i + 1),
      onBranch: ([branchIndex], forest) =>
        TreeF.branchF(
          branchIndex,
          pipe(
            forest,
            Array.map((tree, leafIndex) =>
              map(
                tree,
                Tuple.mapFirst(index => index + leafIndex + branchIndex + 1),
              ),
            ),
          ),
        ),
    }),
  )
  return res
}

export const zsd: (a: Tree<[number, string]>) => Tree<number> =
  treeAna(numberUnfold)



console.debug(pipe(self, drawTree, unlines))

const z = treeCata(numberFold)(from(6, leaf(6), leaf(6), from(6, leaf(6))))
const zz = pipe(
  z,
  map(([s, n]) => `${s}:${n.toString()}`),
)
console.debug(unlines(drawTree(zz)))
*/
//const selfLevels = levels(self)
//
//console.table(selfLevels)
//
//console.table(Paths.encode(self))

// Show fast-check stats from tree arbitrary
//import {map} from '#instances'
//import {branch, leaf, tree, type Leaf, type Tree} from '#tree'
//import {Array, pipe, Tuple} from 'effect'
//import {hylo} from 'effect-ts-folds'
//import * as TreeF from '#treeF'
//import {Indented} from '#codec'
//import {annotateDepthUnfold, preOrderAlgebra} from '#ops'

//
//const arbitrary: fc.Arbitrary<Tree<number>> = getArbitrary({
//  maxDepth: 4,
//  branchBias: 1 / 3,
//})(tinyPositive)
//
//const treeStats = (tree: Tree<number>): string[] => {
//  return [`depth=${depth(tree).toString()}`]
//}

//fc.statistics(arbitrary, treeStats, {numRuns: 1})

//const a = tree(42, [leaf(43)])
//const d = treeCata(maximumHeightAlgebra)(a)
//const e = annotateAlgebra(depthAlgebra)
//const dd = treeCata(e)(a)
//
//console.log(`depth=${d.toString()}`)
//
//console.log(JSON.stringify(dd, undefined, 2))
