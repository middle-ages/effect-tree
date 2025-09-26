import {Array} from '#util'
import {Predicate} from 'effect'
import {type JSDoc} from 'ts-morph'

/**
 * True if JSDoc is on a function and has an example tag.
 */
export const isFunctionExample: Predicate.Predicate<JSDoc> = jsDoc =>
  hasExample(jsDoc) && hasFunction(jsDoc)

/**
 * Get the example source code from a variable JSDoc with an `@example` tag.
 */
export const getExampleSource = (doc: JSDoc): Array.NonEmptyArray<string> => {
  const comment = doc
    .getTags()
    .find(tag => tag.getTagName() === 'example')
    ?.getCommentText()

  if (comment === undefined) {
    console.error(doc.print())
    throw new Error('Found example with no source.')
  }

  return comment.split('\n') as Array.NonEmptyArray<string>
}

/**
 * Check a JSDoc has a tag.
 */
export const hasTag =
  (name: string): Predicate.Predicate<JSDoc> =>
  doc =>
    doc.getTags().some(tag => tag.getTagName() === name)

export const hasFunction: Predicate.Predicate<JSDoc> = hasTag('function')
export const hasExample: Predicate.Predicate<JSDoc> = hasTag('example')
