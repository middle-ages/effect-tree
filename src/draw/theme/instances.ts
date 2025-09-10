import {Covariant as CO, FlatMap as FL, Monad as MD} from '@effect/typeclass'
import {flow, Function, pipe} from 'effect'
import {themed} from './themes.js'
import type {Themed, ThemedTypeLambda} from './types.js'

export const map: CO.Covariant<ThemedTypeLambda>['map'] = Function.dual(
  2,
  <A, B>(self: Themed<A>, f: (a: A) => B): Themed<B> => themed(flow(self, f)),
)

export const imap = CO.imap<ThemedTypeLambda>(map)

export const ThemedCovariant: CO.Covariant<ThemedTypeLambda> = {
  map,
  imap,
}

export const flatten = <A>(self: Themed<Themed<A>>): Themed<A> =>
  themed(theme => self(theme)(theme))

export const of =
  <A>(self: A): Themed<A> =>
  () =>
    self

export const flatMap: FL.FlatMap<ThemedTypeLambda>['flatMap'] = Function.dual(
  2,
  <A, B>(self: Themed<A>, f: (a: A) => Themed<B>) =>
    pipe(self, map(f), flatten),
)

export const ThemedMonad: MD.Monad<ThemedTypeLambda> = {
  ...ThemedCovariant,
  flatMap,
  of,
}
