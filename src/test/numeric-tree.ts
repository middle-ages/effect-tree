import {branch, of, type Tree} from '#tree'

/**
 * Builds a `Tree<number>` that looks like this:
 *
 * ```txt
 *  •──┬─1
 *     ├─┬─2
 *     │ ├───3
 *     │ ├───4
 *     │ └───5
 *     ├─┬─6
 *     │ ├───7
 *     │ ├───8
 *     │ └─┬─11
 *     │   └───9
 *     └───10
 * ```
 */
export const numericTree: Tree<number> = branch(1, [
  branch(2, [of(3), of(4), of(5)]),
  branch(6, [of(7), of(8), branch(11, [of(9)])]),
  of(10),
])
