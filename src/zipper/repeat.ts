import * as Tree from '#tree'
import {dual, type EndoK} from '#util/Function'
import {flow, Option, pipe, type Predicate} from 'effect'
import {getFocus} from './data.js'
import {
  type OptionalZipper,
  type OptionalZipperOf,
  type Zipper,
  type ZipperTypeLambda,
} from './index.js'

/**
 * Repeat the given navigation operator N times and return the final result or
 * `Option.none` if the operator fails along the way.
 *
 * See {@link repeat} for an unsafe version.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @param n - How many times to apply the given navigation. No matter the navigation repeated, if `n=0` the given zipper will be returned unchanged.
 * @returns An updated zipper pointing at a new focus or `Option.none()` if the navigation failed because the path is invalid.
 * @category zipper
 * @function
 */
export const tryRepeat: {
  <A>(self: Zipper<A>, n: number, nav: OptionalZipper): Option.Option<Zipper<A>>
  (n: number, nav: OptionalZipper): OptionalZipper
} = dual(
  3,
  <A>(
    self: Zipper<A>,
    n: number,
    nav: OptionalZipper,
  ): Option.Option<Zipper<A>> => {
    let current = self
    for (let index = 0; index < n; index++) {
      const option = nav(current)
      if (Option.isNone(option)) {
        return option
      }
      current = option.value
    }

    return Option.some(current)
  },
)

/**
 * Repeat the given navigation function of type `Zipper<A> ⇒ Option<Zipper<A>>`
 * on the focus node iteratively, updating the focus node with the result
 * until the focus node meets the given predicate or the navigation terminates
 * by returning `Option.none`, for example when reaching the last element of a
 * forest with the {@link tryNext} navigation, or the final depth-first node of
 * the tree with {@link tryDepthFirst} navigation.
 *
 * If the predicate matched, then the zipper is returned pointing at the
 * matching tree node. If it did not, returns `Option.none`.
 *
 * If a cycle in navigation is detected a runtime exception is thrown. Cycles
 * are detected by checking no node is visited twice, so if your navigation
 * does this it will throw a runtime exception even if there are no actual
 * cycles in the navigation. Keep your navigation pointing one way, for example
 * _depth first_, to avoid creating cycles.
 *
 * See {@link repeatUntilValue} for a version that matches on the focused tree
 * node _value_ instead of the focused tree node.
 * @typeParam A - The underlying type of the tree.
 * @param navigation - A function that takes a zipper and returns either an updated zipper focused on a different tree node, or `Option.none`.
 * @param predicate - Will be matched against every tree node reached by the navigation.
 * @returns An updated zipper if the search criteria matched an element along the navigation given, else `Option.none`.
 * @category zipper
 * @function
 */
export const repeatUntil =
  <A>(
    navigation: OptionalZipper,
    predicate: Predicate.Predicate<Tree.Tree<A>>,
  ) =>
  /** The zipper that will be navigated. */
  (self: Zipper<A>): Option.Option<Zipper<A>> => {
    const visited = new Set()
    let current = Option.some(self)
    visited.add(getFocus(self))

    while (Option.isSome(current)) {
      if (pipe(current.value, getFocus, predicate)) {
        return current
      }
      current = Option.flatMap(current, navigation)
      if (Option.isSome(current)) {
        const node = getFocus(current.value)
        if (visited.has(node)) {
          throw new Error('Detected cycle in a “repeatUntil” navigation')
        }
        visited.add(node)
      }
    }
    return Option.none()
  }

/**
 * Repeat the given navigation function of type `Zipper<A> ⇒ Option<Zipper<A>>`
 * on the focus node iteratively, updating the focus node with the result
 * until the focus node _value_ meets the given predicate or the navigation
 * terminates by returning `Option.none`, for example when reaching the last
 * element of a forest with the {@link tryNext} navigation, or the final
 * depth-first node of the tree with {@link tryDepthFirst} navigation.
 *
 * If the predicate matched, then the zipper is returned pointing at the
 * matching tree node. If it did not, returns `Option.none`.
 *
 * If a cycle in navigation is detected a runtime exception is thrown. Cycles
 * are detected by checking no node is visited twice, so if your navigation
 * does this it will throw a runtime exception even if there are no actual
 * cycles in the navigation. Keep your navigation pointing one way, for example
 * _depth first_, to avoid creating cycles.
 *
 * See {@link repeatUntil} for a version that matches on the focused tree
 * node and not just its value which allows you, for example, to test the node
 * children.
 * @typeParam A - The underlying type of the tree.
 * @param navigation - A function that takes a zipper and returns either an updated zipper focused on a different tree node, or `Option.none`.
 * @param predicate - Will be matched against every tree node reached by the navigation.
 * @returns An updated zipper if the search criteria matched an element along the navigation given, else `Option.none`.
 *
 * @category zipper
 * @function
 */
export const repeatUntilValue = <A>(
  navigation: OptionalZipper,
  predicate: Predicate.Predicate<A>,
): OptionalZipperOf<A> =>
  flow(repeatUntil(navigation, flow(Tree.getValue, predicate)))

/**
 * Repeat the given navigation operator N times and return the final result or
 * throw and exception if the operator fails along the way.
 * Unsafe version of {@link tryRepeat}.
 * @typeParam A - The underlying type of the tree.
 * @param self - The zipper that will be navigated.
 * @returns An updated zipper pointing at a new focus.
 * @category zipper
 * @function
 */
export const repeat: {
  <A>(self: Zipper<A>, n: number, nav: OptionalZipper): Zipper<A>
  (n: number, nav: OptionalZipper): EndoK<ZipperTypeLambda>
} = dual(
  3,
  <A>(self: Zipper<A>, n: number, nav: OptionalZipper): Zipper<A> =>
    pipe(self, tryRepeat(n, nav), Option.getOrThrow),
)
