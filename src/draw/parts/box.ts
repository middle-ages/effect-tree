import {filterDefined} from '#util/Record'
import {pipe, dual, type EndoOf} from '#util/Function'
import type {BorderSet} from '../glyph.js'
import {borderSet} from '../glyph.js'
import type {Part} from '../part.js'
import {noPadding, type DirectedPad} from './pad.js'
import {spacePad} from './atoms.js'
import {addBorder} from './borders.js'

export interface BoxSettings {
  padding: DirectedPad
  margin: DirectedPad
  border: BorderSet
}

const defaultSettings: BoxSettings = {
  padding: noPadding,
  margin: noPadding,
  border: borderSet('thin'),
}

const normalizeSettings = (
  partial: Partial<BoxSettings> = defaultSettings,
): BoxSettings => ({
  padding: {
    ...noPadding,
    ...filterDefined(partial.padding ?? {}),
  },
  margin: {
    ...noPadding,
    ...filterDefined(partial.margin ?? {}),
  },
  border: partial.border ?? borderSet('thin'),
})

/**
 * Wrap a part in a configurable bordered box.
 * @category drawing
 */
export const box: {
  (part: Part, settings?: Partial<BoxSettings>): Part
  (settings?: Partial<BoxSettings>): EndoOf<Part>
} = dual(2, (part: Part, rawSettings?: Partial<BoxSettings>): Part => {
  const {padding, margin, border} = normalizeSettings(rawSettings)
  return pipe(
    part,
    spacePad(padding),
    addBorder.curried(border),
    spacePad(margin),
  )
})
