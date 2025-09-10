import {folds} from '#folds'
import {treeHylo, type TreeFolder, type TreeUnfolder} from '#tree'
import {unfolds} from '#unfolds'
import {expect, test} from 'vitest'

test('treeHylo', () => {
  const φ: TreeFolder<number, number> = folds.numericSum,
    ψ: TreeUnfolder<number, number> = unfolds.levelTree({
      depth: 5,
      degree: () => 2,
    })

  //   n
  //   Σ i ⋅ 2ⁱ⁻¹ = 1⋅3⁰ + 2⋅2¹ + 3⋅2² + … + n⋅2ⁿ⁻¹ = (n - 1) ⋅ 2ⁿ + 1
  // i=1
  const expectSum = (n: number) => (n - 1) * 2 ** n + 1

  // Unfold a binary tree of three levels and sum the nodes in a
  // single traversal.
  expect(treeHylo(ψ, φ)(1)).toBe(expectSum(5))
})
