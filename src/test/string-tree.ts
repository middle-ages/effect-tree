/* eslint-disable sonarjs/no-hardcoded-ip */
import {test, expect} from 'vitest'
import {branch, leaf, treeCata, type Tree, type TreeFolder} from '#tree'
import {pipe} from 'effect'

/**
 * Builds a `Tree<string>` that looks like this:
 *
 * ```txt
 *  •──┬─“1”
 *     │
 *     ├───“1.1”
 *     │
 *     ├─┬─“1.2”
 *     │ │
 *     │ ├───“1.2.1”
 *     │ ├───“1.2.2”
 *     │ └───“1.2.3”
 *     │
 *     ├─┬─“1.3”
 *     │ └─┬─“1.3.1”
 *     │   └─┬─“1.3.1.1”
 *     │     └───“1.3.1.1.1”
 *     │
 *     └───“1.4”
 *
 * ```
 */
export const stringTree: Tree<string> = branch('1', [
  leaf('1.1'),
  branch('1.2', [leaf('1.2.1'), leaf('1.2.2'), leaf('1.2.3')]),
  branch('1.3', [branch('1.3.1', [branch('1.3.1.1', [leaf('1.3.1.1.1')])])]),
  leaf('1.4'),
])

export const testStringTreeFold =
  <A>(φ: TreeFolder<string, A>) =>
  (name: string, expected: A) => {
    test(name, () => {
      expect(pipe(stringTree, treeCata(φ))).toEqual(expected)
    })
  }
