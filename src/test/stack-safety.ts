import {of, tree, type Tree} from '#tree'
import {pipe} from 'effect'
import {assert, test} from 'vitest'

const overflow = 12_000

// Build a deep and narrow tree for stack-safety tests
export const buildDeep =
  <A>(makeTree: (rootValue: number, nodes: Tree<A>[]) => Tree<A>) =>
  (from: Tree<A>): [Tree<A>, number] => {
    let tree = from,
      i = 1
    while (i++ < overflow) tree = makeTree(i, [tree])
    return [tree, overflow]
  }

export const testStackSafety =
  (name: string) =>
  <A>({
    iut,
    seed,
    makeTree,
  }: {
    seed: Tree<A>
    makeTree: (node: number, forest: Tree<A>[]) => Tree<A>
    iut: (self: Tree<A>) => unknown
  }) => {
    const [t, overflow] = pipe(seed, buildDeep(makeTree))

    test(`${name} (${overflow.toLocaleString()} iterations)`, () => {
      assert.doesNotThrow(() => {
        iut(t)
      })
    })
  }

export const testNumericTreeStackSafety = (
  name: string,
  iut: (self: Tree<number>) => unknown,
) => {
  testStackSafety(name)<number>({iut, seed: of(1), makeTree: tree})
}
