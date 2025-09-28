import {longestChildLength, shortestChildLength} from '#Array'
import {type EndoOf} from '#Function'
import {fromNumber, suffix, unwords, widestLine} from '#String'
import {Array, flow, pipe} from 'effect'
import type {NonEmptyArray} from 'effect/Array'
import {describe, expect, test} from 'vitest'
import {HStrut, HStruts, VStrut, VStruts} from '../struts.js'
import {
  forHorizontalAlignments,
  forVerticalAlignments,
  showAlignment,
  type HorizontalAlignment,
  type VerticalAlignment,
} from './data.js'
import {alignHorizontally} from './horizontally.js'
import {alignVertically} from './vertically.js'

type Columns = NonEmptyArray<string[]>

const testAlign =
  (
    hAlign: HorizontalAlignment,
    topStrut = VStrut(['∘']),
    leftStrut = HStrut(['•']),
  ) =>
  (
    {
      align,
      top,
      middle,
      bottom,
    }: {
      align: Columns
      top: Columns
      middle: Columns
      bottom: Columns
    },
    useTopRound?: boolean,
  ) => {
    const expected = [top, middle, bottom] as const
    const [min, max] = [
      `${shortestChildLength(align).toString()}ᴴₘᵢₙ`,
      `${longestChildLength(align).toString()}ᴴₘₐₓ`,
    ]

    const widths = pipe(
      align,
      Array.map(flow(widestLine, fromNumber, suffix('ᵂₘₐₓ'))),
      unwords.comma,
    )

    const alignOrthogonal: EndoOf<string[]> = alignHorizontally(
      HStruts(leftStrut),
      hAlign,
    )

    const name = `{${widths}}×{${max}:${min}}`

    describe(name, () => {
      forVerticalAlignments((vAlign: VerticalAlignment, i) => {
        test(showAlignment(vAlign) + '.' + showAlignment(hAlign), () => {
          expect(
            (useTopRound ? alignVertically.useTopRound : alignVertically)(
              VStruts(topStrut),
              vAlign,
              alignOrthogonal,
            )(align),
            `${hAlign},${vAlign}`,
          ).toEqual(expected[i])
        })
      })
    })
  }

const {
  left: testLeft,
  center: testCenter,
  right: testRight,
} = forHorizontalAlignments(hAlign => testAlign(hAlign))

describe('align left', () => {
  testCenter({
    align: [[]],
    top: [[]],
    middle: [[]],
    bottom: [[]],
  })

  describe('columnCount≔1', () => {
    describe('rowCount≔1', () => {
      testLeft({
        align: [['a']],
        top: [['a']],
        middle: [['a']],
        bottom: [['a']],
      })
    })

    describe('rowCount≔2', () => {
      testLeft({
        align: [['a', 'bc']],
        top: [['a•', 'bc']],
        middle: [['a•', 'bc']],
        bottom: [['a•', 'bc']],
      })
    })
  })

  describe('columnCount≔2', () => {
    describe('rowCount≔1', () => {
      testLeft({
        align: [['a'], ['b']],
        top: [['a'], ['b']],
        middle: [['a'], ['b']],
        bottom: [['a'], ['b']],
      })
    })

    describe('rowCount≔2, same height', () => {
      testLeft({
        align: [
          ['a', 'bc'],
          ['ABCD', 'A'],
        ],
        top: [
          ['a•', 'bc'],
          ['ABCD', 'A•••'],
        ],
        middle: [
          ['a•', 'bc'],
          ['ABCD', 'A•••'],
        ],
        bottom: [
          ['a•', 'bc'],
          ['ABCD', 'A•••'],
        ],
      })
    })
  })
})

describe('rowCount≔4, different heights', () => {
  testLeft({
    align: [
      ['a', 'bc'],
      ['ABCD', 'ABC', 'AB', 'D'],
    ],
    top: [
      ['a•', 'bc', '∘•', '∘•'],
      ['ABCD', 'ABC•', 'AB••', 'D•••'],
    ],
    middle: [
      ['∘•', 'a•', 'bc', '∘•'],
      ['ABCD', 'ABC•', 'AB••', 'D•••'],
    ],
    bottom: [
      ['∘•', '∘•', 'a•', 'bc'],
      ['ABCD', 'ABC•', 'AB••', 'D•••'],
    ],
  })

  testCenter({
    align: [
      ['a', 'bc'],
      ['ABCD', 'ABC', 'AB', 'D'],
    ],
    top: [
      ['a•', 'bc', '∘•', '∘•'],
      ['ABCD', 'ABC•', '•AB•', '•D••'],
    ],
    middle: [
      ['∘•', 'a•', 'bc', '∘•'],
      ['ABCD', 'ABC•', '•AB•', '•D••'],
    ],
    bottom: [
      ['∘•', '∘•', 'a•', 'bc'],
      ['ABCD', 'ABC•', '•AB•', '•D••'],
    ],
  })

  testRight({
    align: [
      ['a', 'bc'],
      ['ABCD', 'ABC', 'AB', 'D'],
    ],
    top: [
      ['•a', 'bc', '•∘', '•∘'],
      ['ABCD', '•ABC', '••AB', '•••D'],
    ],
    middle: [
      ['•∘', '•a', 'bc', '•∘'],
      ['ABCD', '•ABC', '••AB', '•••D'],
    ],
    bottom: [
      ['•∘', '•∘', '•a', 'bc'],
      ['ABCD', '•ABC', '••AB', '•••D'],
    ],
  })
})

describe('default bottom round', () => {
  testCenter(
    {
      align: [['one line'], ['four', 'lines', 'of', 'text']],
      top: [
        ['one line', '•••∘••••', '•••∘••••', '•••∘••••'],
        ['four•', 'lines', '•of••', 'text•'],
      ],
      middle: [
        ['•••∘••••', '•••∘••••', 'one line', '•••∘••••'],
        ['four•', 'lines', '•of••', 'text•'],
      ],

      bottom: [
        ['•••∘••••', '•••∘••••', '•••∘••••', 'one line'],
        ['four•', 'lines', '•of••', 'text•'],
      ],
    },
    false,
  )
})

describe('useTopRound', () => {
  testCenter(
    {
      align: [['one line'], ['four', 'lines', 'of', 'text']],
      top: [
        ['one line', '•••∘••••', '•••∘••••', '•••∘••••'],
        ['four•', 'lines', '•of••', 'text•'],
      ],
      middle: [
        ['•••∘••••', 'one line', '•••∘••••', '•••∘••••'],
        ['four•', 'lines', '•of••', 'text•'],
      ],

      bottom: [
        ['•••∘••••', '•••∘••••', '•••∘••••', 'one line'],
        ['four•', 'lines', '•of••', 'text•'],
      ],
    },
    true,
  )
})
