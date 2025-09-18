import {map} from '#tree'
import {flow, pipe} from '#util'
import {borderSet, elbowSet} from '../glyph.js'
import {teeSet} from '../glyph/tees.js'
import {drawPart, text} from '../part.js'
import {box} from '../parts.js'
import {
  getTheme,
  themedTree,
  type StringDraw,
  type Theme,
  type ThemeName,
} from '../tree.js'

/**
 * Just like {@link themedTree} except all nodes are wrapped in thin boxes.
 * @category drawing
 */
export const themedBoxNodes =
  (theme: Theme): StringDraw =>
  self =>
    pipe(self, map(flow(pointyBox, drawPart.unlines)), themedTree(theme))

/**
 * Just like {@link themedBoxNodes} except takes a theme _name_.
 * @category drawing
 */
export const boxedNodes: (name: ThemeName) => StringDraw = rawTheme => {
  const theme: Theme = {...getTheme(rawTheme), indents: 4}
  return themedBoxNodes(theme)
}

const pointyBox = (s: string) =>
  pipe(
    s,
    text,
    box({
      border: {
        ...borderSet('thin'),
        elbows: {
          ...elbowSet('thin'),
          topLeft: teeSet('thin').bottom,
        },
      },
    }),
  )
