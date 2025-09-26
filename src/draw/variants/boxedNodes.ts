import {flow, Function, pipe} from '#util'
import {borderSet, elbowSet} from '../glyph.js'
import {teeSet} from '../glyph/tees.js'
import {drawPart, text} from '../part.js'
import {box} from '../parts.js'
import {type Theme, setFormatter, setIndents} from '../tree.js'

/**
 * Set the theme formatter to draw boxes around nodes.
 * @category drawing
 * @function
 */
export const setBoxNodesFormatter: Function.EndoOf<Theme> = flow(
  setFormatter(pointyBox),
  setIndents(4),
)

function pointyBox(s: string): string {
  return pipe(
    s,
    text,
    box.curried({
      border: {
        ...borderSet('thin'),
        elbows: {
          ...elbowSet('thin'),
          topLeft: teeSet('thin').bottom,
        },
      },
    }),
    drawPart.unlines,
  )
}
