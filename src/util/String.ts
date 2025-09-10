import {String, pipe, Predicate} from 'effect'
import * as tty from 'tty-strings'
import * as Array from './Array.js'
import type {EndoOf} from './Function.js'
import * as Number from './Number.js'
import {floorMod} from './Number.js'
import {pairMap, type Pair} from './Pair.js'
import * as Tuple from './Tuple.js'

export * from 'effect/String'

/** Surround a string with the given string pair. */
export const surround =
  ([prefix, suffix]: Pair<string>): EndoOf<string> =>
  s =>
    `${prefix}${s}${suffix}`

/** An untupled version of {@link surround}. */
surround.rest = (prefix: string, suffix: string): EndoOf<string> =>
  surround([prefix, suffix])

/** Surround with parentheses. */
surround.parentheses = surround(['(', ')'])

/** Surround with square brackets. */
surround.squareBrackets = surround(['[', ']'])

/** Surround with curly brackets. */
surround.curlyBrackets = surround(['{', '}'])

/** Surround with angled brackets. */
surround.angledBrackets = surround(['<', '>'])

/** Single-quote a string. */
surround.quote = Object.assign(surround(["'", "'"]), {
  /** Double-quote a string. */
  double: surround(['"', '"']),

  /** Fancy-quote a string. */
  fancy: surround(['“', '”']),

  /** Surround with parentheses. */
  parentheses: surround(['(', ')']),

  /** Surround with square brackets. */
  squareBrackets: surround(['[', ']']),

  /** Surround with curly brackets. */
  curlyBrackets: surround(['{', '}']),

  /** Surround with angled brackets. */
  angledBrackets: surround(['<', '>']),
})

/** True if string is surrounded by given prefix and suffix. */
export const isSurroundedBy =
  (prefix: string, suffix: string): Predicate.Predicate<string> =>
  s =>
    s.startsWith(prefix) && s.endsWith(suffix)

/** Build a multiline string from an array of lines. */
export const unlines = (lines: ReadonlyArray<string>): string =>
  lines.join('\n')

/** Just like `unlines` but double spaced. */
unlines.double = (lines: ReadonlyArray<string>): string => lines.join('\n\n')

/** An untupled version of {@link unlines}. */
unlines.rest = (...lines: ReadonlyArray<string>): string => unlines(lines)

/** Build a line from an array of words. */
export const unwords = (words: ReadonlyArray<string>): string => words.join('')

/** An untupled version of {@link unwords}. */
unwords.rest = (...words: ReadonlyArray<string>): string => unwords(words)

/** Join a string array with a pipeline (`|`) character. */
unwords.pipeline = (s: readonly string[]) => pipe(s, Array.join(' | '))

/** Join a string array with a pipeline (`/`) character. */
unwords.slash = (s: readonly string[]) => pipe(s, Array.join(' | '))

/** Build a line by joining an array of words with spaces between them. */
unwords.spaced = Object.assign(
  (words: ReadonlyArray<string>): string => words.join(' '),
  {
    /** An untupled version of {@link unwords.spaced}. */
    rest: (...words: ReadonlyArray<string>): string => words.join(' '),

    /** Space-join a literal string array into a literal string. */
    literal: <const Words extends readonly [string, ...(readonly string[])]>(
      ...words: Words
    ) => words.join(' ') as Spaced<Words>,
  },
)

/** Join a literal string with spaces. */
export type Spaced<
  Words extends readonly string[],
  Carry extends string = '',
> = Words extends readonly []
  ? Carry
  : Words extends readonly [
        infer Head extends string,
        ...infer Tail extends readonly string[],
      ]
    ? Carry extends ''
      ? Spaced<Tail, Head>
      : Spaced<Tail, `${Carry} ${Head}`>
    : never

/** Build a line by joining an array of words with commas between them. */
unwords.comma = Object.assign(
  (words: ReadonlyArray<string>): string => words.join(', '),
  {
    /** An untupled version of {@link unwords.comma}. */
    rest: (...words: ReadonlyArray<string>): string => words.join(', '),
  },
)

/** Build line by double quoting string array and joining with commas. */
unwords.quote = Object.assign(
  (words: ReadonlyArray<string>): string =>
    pipe(words, Array.map(surround.quote), unwords.comma),
  {
    /** Build line by double quoting string array and joining with commas. */
    double: (words: ReadonlyArray<string>) =>
      pipe(words, Array.map(surround.quote.double), unwords.comma),

    /** Build line by fancy quoting string array and joining with commas. */
    fancy: (words: ReadonlyArray<string>) =>
      pipe(words, Array.map(surround.quote.fancy), unwords.comma),
  },
)

/** Prefix a string. A flipped version of `String.concat`. */
export const prefix =
  (prefix: string): EndoOf<string> =>
  s =>
    String.concat(prefix, s)

/** Suffix a string. A curried version of `String.concat`. */
export const suffix: (suffix: string) => EndoOf<string> = String.concat

/** Add an `s` suffix to the word unless the given number equals one. */
export const plural = (word: string, n: number): string =>
  n === 1 ? word : `${word}s`

/**
 * Add an `s` suffix to the word unless the given number equals one,
 * and prefix with the string of the given numeric value.
 */
export const pluralNumber = (word: string, n: number): string =>
  unwords.spaced.rest(n.toString(), plural(word, n))

/** Call `toString()` on the given number. */
export const fromNumber = (n: number): string => n.toString()

/** Curried equivalence for strings. */
export const isEqual =
  (self: string): Predicate.Predicate<string> =>
  other =>
    self === other

/** ANSI/unicode string width. */
export const stringWidth = tty.stringWidth as (s: string) => number

/** Convert a list of strings to their lengths. */
export const stringWidths = Array.map<string[], number>(stringWidth)

/** A string `n` characters long made up of spaces. */
export const nSpaces = (n: number): string => pipe(' ', String.repeat(n))

/** Raise the case of the 1st letter in the given string. */
export const toUpperCaseFirst = <const S extends string>(s: S) =>
  (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>

/** Lower the case of the 1st letter in the given string. */
export const toLowerCaseFirst = <const S extends string>(s: S) =>
  (s.charAt(0).toLowerCase() + s.slice(1)) as Uncapitalize<S>

/** Fill available space with given multiline fill string. */
export function fillLines(available: number) {
  return (fill: Array.NonEmptyArray<string>): string[] => {
    const fillLength = fill.length
    if (available === 0) return []

    const Δ = available - fillLength
    if (Δ <= 0) return fill.slice(0, available)

    const [quotient, remainder] = pipe(
      floorMod(available, fillLength),
      Tuple.mapFirst(Number.decrement),
      pairMap(n => pipe(fill, Array.replicate(n), Array.flatten)),
    )

    return [...quotient, ...remainder]
  }
}

export const widestLine = (lines: string[]): number =>
  Array.max(Number.Order)([0, ...stringWidths(lines)])

export const hSeparator = (lines: string[]): string =>
  pipe('─', String.repeat(widestLine(lines)))

/** Convert `SomeLongWord` into `Some long word`. */
export const toSpacedLowercase: EndoOf<string> = s =>
  s === ''
    ? ''
    : pipe(
        s.replaceAll(/([A-Z])/g, ' $1'),
        String.toLowerCase,
        toUpperCaseFirst,
      ).slice(1)

export const takeWhile = (f: Predicate.Predicate<string>) => (s: string) => {
  let i = 0
  while (f(s[i] as string) && i < s.length) {
    i++
  }
  return s.slice(0, i)
}
