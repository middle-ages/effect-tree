import {type Tree} from '#tree'
import type {HKT} from 'effect'
import {type Part} from '../part/types.js'
import {glyphMap} from './glyph.js'
import {type GlyphRoleMap, type Theme} from './themes.js'

export interface ThemedTypeLambda extends HKT.TypeLambda {
  readonly type: Themed<this['Target']>
}

/** Names of available glyph sets mapping roles to glyphs. */
export type GlyphSetName = keyof typeof glyphMap

/** Dictionary of glyph role sets by name. */
export type GlyphMap = Record<GlyphSetName, GlyphRoleMap>

/** A function that requires a theme. */
export type Themed<A> = (theme: Theme) => A

/** A part that requires a theme. */
export type ThemedPart<A> = (theme: Theme, a: A) => Part

/** A string tree that requires a theme. */
export type TreeLayout = ThemedPart<Tree<string>>
