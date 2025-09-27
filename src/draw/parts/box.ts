import {pipe, type EndoOf} from '#Function'
import {filterDefined} from '#Record'
import type {HorizontalAlignment} from '../align.js'
import type {BorderSet} from '../glyph.js'
import {borderSet} from '../glyph.js'
import type {Part} from '../part.js'
import {stackText, spacePad} from './atoms.js'
import {addBorder} from './borders.js'
import {noPadding, type DirectedPad} from './pad.js'

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
const _box = (part: Part, rawSettings?: Partial<BoxSettings>): Part => {
  const {padding, margin, border} = normalizeSettings(rawSettings)
  return pipe(
    part,
    spacePad(padding),
    addBorder.curried(border),
    spacePad(margin),
  )
}

/**
 * Wrap a part in a configurable bordered box.
 *
 * At the `curried` key you can find a curried version that takes the settings
 * as first argument.
 *
 * At the `lines` key you will find a version that takes an array of text lines
 * instead of a part. They will be added to a column and the column will become
 * the boxed part.
 * @param part Part to be boxed.
 * @param settings Optional box settings.
 * @category drawing
 * @function
 */
export const box: {
  (part: Part, settings?: Partial<BoxSettings>): Part
  curried: (settings?: Partial<BoxSettings>) => EndoOf<Part>
  lines: (
    settings?: Partial<BoxSettings>,
  ) => (lines: string[], hAlign?: HorizontalAlignment) => Part
} = Object.assign(_box, {
  curried:
    (settings?: Partial<BoxSettings>): EndoOf<Part> =>
    part =>
      _box(part, settings),
  lines:
    (settings?: Partial<BoxSettings>) =>
    (lines: string[], hAlign: HorizontalAlignment = 'center'): Part =>
      _box(stackText(lines, hAlign), settings),
})
