import type {Fix} from 'effect-ts-folds'
import {
  ColumnF,
  EmptyF,
  type PartFTypeLambda,
  RowF,
  type Text,
} from './partF.js'

import type * as AL from './align/data.js'

export type Alignment = AL.Alignment
export type HorizontalAlignment = AL.HorizontalAlignment
export type VerticalAlignment = AL.VerticalAlignment

export type Aligned = AL.Aligned
export type HorizontallyAligned = AL.HorizontallyAligned
export type VerticallyAligned = AL.VerticallyAligned

export type Empty = {unfixed: EmptyF} & Fix<PartFTypeLambda>
export type Row = {unfixed: RowF<Part>} & Fix<PartFTypeLambda>
export type Column = {unfixed: ColumnF<Part>} & Fix<PartFTypeLambda>

export type Part = Empty | Text | Row | Column
