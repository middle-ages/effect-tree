import {type Tree} from '#tree'
import type {HKT} from 'effect'
import {type Part} from '../part/types.js'
import {glyphMap} from './glyph.js'
import {type GlyphRoleMap, type Theme} from './themes.js'

/**
 * Type lambda for `Theme`.
 * `Kind<ThemedTypeLambda, never, unknown, unknown, A> ≡ Theme<A>`
 * @category drawing
 */
export interface ThemedTypeLambda extends HKT.TypeLambda {
  readonly type: Themed<this['Target']>
}

/**
 * Names of available glyph sets mapping roles to glyphs.
 * @category drawing
 */
export type GlyphSetName = keyof typeof glyphMap

/**
 * Dictionary of glyph role sets by name.
 * @category drawing
 */
export type GlyphMap = Record<GlyphSetName, GlyphRoleMap>

/**
 * A function that requires a theme.
 * @category drawing
 */
export type Themed<A> = (theme: Theme) => A

/**
 * A themed part is exactly like a {@link Part} except:
 *
 * 1. Author of the `Part` has access to the `Theme` when building the part.
 * 1. It requires a {@link Theme} to be drawn.
 * 1. A `ThemePart<A>` requires not just a theme, but also an argument of type `A` to actually build the part.
 * @category drawing
 */
export type ThemedPart<A> = (theme: Theme, a: A) => Part

/**
 * A function that given a {@link Theme} and a string {@link Tree} will return a
 * {@link Part}.
 * @category drawing
 */
export type TreeLayout = ThemedPart<Tree<string>>
