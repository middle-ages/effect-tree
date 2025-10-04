import {K} from '#Function'
import {pair, square} from '#Pair'
import {Order} from '#util'
import {Array, Option, pipe} from 'effect'

/**
 * Zip a list of options with the ordinal of the `somes` giving each unique
 * `some` its own ordinal.
 *
 * For example this list of string options:
 *
 * const options = [
 *   Option.some('I'),
 *   Option.none(),
 *   Option.some('II'),
 *   Option.some('II'),
 *   Option.some('III'),
 *   Option.none(),
 * ]
 *
 * When run through `zipUniqueOrdinal` with the ordinal starting at 5:
 *
 * const zipped = zipUniqueOrdinal(String.Equivalence)(options, 5)
 *
 * zipped = [
 *   Option.some(['I', 5]),
 *   Option.none(),
 *   Option.some(['II', 6]),
 *   Option.some(['II', 6]),
 *   Option.some(['III', 7]),
 *   Option.none(),
 * ]
 *
 * The input requirements:
 *
 * 1. The `A`s are grouped. This is illegal: I, II, I, III, but this is
 *    legal: I, I, II, III.
 * 2. No `None` values inside these groups, only between them.
 *
 * @category internal
 */
export const zipUniqueOrdinal =
  <A>(order: Order.Order<A>) =>
  (previousOrdinal: number) =>
  (xs: Options<A>): [options: Options<State<A>>, previousOrdinal: number] => {
    const equals = Order.orderToEqual(order)
    const [head, ...tail] = xs

    const scanned = Array.scan(
      tail,
      Option.match<A, State<A>>(head, {
        onNone: K([undefined, previousOrdinal] as const),
        onSome: pair.withSecond(previousOrdinal + 1),
      }),
      ([previous, i], current) =>
        Option.match<A, State<A>>(current, {
          onNone: K([undefined, i] as const),
          onSome: square.mapSecond(value =>
            previous !== undefined && equals(value, previous) ? i : i + 1,
          ),
        }),
    )

    return [asOptions(scanned), scanned.at(-1)?.at(-1) as number]
  }

const asOptions: <A>(
  xs: Array.NonEmptyArray<State<A>>,
) => Options<readonly [A, number]> = Array.map(([value, i]) =>
  pipe(value, Option.fromNullable, Option.map(pair.withSecond(i))),
)

type Options<A> = Array.NonEmptyArray<Option.Option<A>>

type State<A> = readonly [A | undefined, number]
