/** A simple tree parser for use in tests. */
import {Array, identity, pipe, String as STR} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import type {TreeUnfolder, TreeFolder} from '#tree'
import * as TreeF from '#treeF'

//
// Fold a level of a string tree into the string:
//
//    NODE(CHILD₁, CHILD₂, ...,CHILDₙ)
//
export const bracketFold: TreeFolder<string, string> = TreeF.match({
  onLeaf: identity,
  onBranch: (node, forest) => `${node}(${forest.join(', ')})`,
})

//
// Unfold a single level from strings of the recursive form:
//
//    CHILD ≡ NODE(CHILD₁, CHILD₂, ...,CHILDₙ)
//
// Into a single level of a string tree.
//
export const bracketUnfold: TreeUnfolder<
  string,
  NonEmptyArray<Token>
> = tokens => {
  const [open, ...forest]: Token[][] = parser(tokens)
  return TreeF.treeF(open?.at(0)?.value ?? '', forest.slice(0, -1))
}

export interface Token {
  type: 'open' | 'name' | 'close'
  value?: string
}

const openRe = String.raw`\(`,
  closeRe = String.raw`\)`,
  separatorRe = ',',
  nameRe = `[^${separatorRe}${openRe}${closeRe}]+${openRe}?`

// Parse a single level from strings of the recursive form:
//
//    CHILD ≡ NODE(CHILD₁, CHILD₂, ...,CHILDₙ)
//
// Into a list of list of tokens. The 1st list will be the
// NODE. The rest of the lists will be its CHILD elements.
//
export const parser = (tokens: NonEmptyArray<Token>): Token[][] => {
  if (tokens.length === 0) return []
  const [head, ...tail] = tokens
  const parsed: Token[][] = [[head]]
  let level = 1
  for (const token of tail) {
    const {type} = token
    if (level === 1) parsed.push([token])
    else {
      const popped = parsed.pop()
      if (popped === undefined) return []
      parsed.push([...popped, token])
    }
    level += type === 'open' ? 1 : type === 'close' ? -1 : 0
  }
  return level === 1 || level === 0 ? parsed : []
}

// Split an expression into lexical tokens
export const lexer: (s: string) => NonEmptyArray<Token> = s => {
  return pipe(
    s,
    STR.split(/,/),
    split(closeRe),
    split(nameRe),
    Array.filter(STR.isNonEmpty),
    Array.map(s =>
      s === ')'
        ? {type: 'close', value: ''}
        : {
            type: new RegExp(`.*${openRe}$`).test(s) ? 'open' : 'name',
            value: s.replaceAll(new RegExp(openRe, 'g'), ''),
          },
    ),
  ) as NonEmptyArray<Token>
}

const split = (re: string) => (s: string[]) =>
  pipe(
    s,
    Array.flatMap((s: string) => s.split(new RegExp(`(${re})`))),
  ).map(s => s.replaceAll(' ', ''))
