import {drawPart, getTheme, themedTree, treeToPart} from '#draw'
import {assertDrawTree, drawTree as drawTestTree} from '#test'
import {branch, from, of} from '#tree'
import {pipe} from 'effect'
import {describe, expect, test} from 'vitest'

test('leaf', () => {
  pipe('a', of, assertDrawTree('\n─a'))
})

test('One branch one leaf', () => {
  pipe(branch('a', [of('b')]), assertDrawTree('\n┬a\n└─b'))
})

describe(`multiline labels`, () => {
  test(`leaf`, () => {
    const tree = branch('a', [
      of('b1\nb2\nb3'),
      branch('c', [of('d'), of('e1\ne2\ne3'), of('f')]),
      of('g1\ng2\ng3'),
    ])

    pipe(
      tree,
      assertDrawTree(`
┬a
├─b1
│ b2
│ b3
├┬c
│├─d
│├─e1
││ e2
││ e3
│└─f
└─g1
  g2
  g3`),
    )
  })

  test(`branch`, () => {
    const tree = branch('a', [
      of('b'),
      branch('c1\nc2\nc3', [of('d'), of('e'), of('f')]),
      of('g'),
    ])

    pipe(
      tree,
      assertDrawTree(`
┬a
├─b
├┬c1
││c2
││c3
│├─d
│├─e
│└─f
└─g`),
    )
  })

  test(`both`, () => {
    const tree = branch('a1\na2', [
      of('b1\nb2'),
      branch('c1\nc2', [of('d1\nd2'), of('e1\ne2')]),
      branch('f1\nf2', [of('g1\ng2')]),
    ])

    pipe(
      tree,
      assertDrawTree(`
┬a1
│a2
├─b1
│ b2
├┬c1
││c2
│├─d1
││ d2
│└─e1
│  e2
└┬f1
 │f2
 └─g1
   g2`),
    )
  })
})

describe('nodeCount≔11', () => {
  const tree = branch('a', [
    of('b'),
    branch('c', [of('d'), of('e')]),
    branch('f', [of('g'), branch('h', [of('i'), of('j')]), of('k')]),
  ])

  test('theme≔“thin”', () => {
    pipe(
      tree,
      assertDrawTree(`
┬a
├─b
├┬c
│├─d
│└─e
└┬f
 ├─g
 ├┬h
 │├─i
 │└─j
 └─k`),
    )
  })

  test('theme≔“round”', () => {
    expect(drawTestTree(tree, getTheme('round'))).toBe(`
┬a
├─b
├┬c
│├─d
│╰─e
╰┬f
 ├─g
 ├┬h
 │├─i
 │╰─j
 ╰─k`)
  })

  describe('theme≔“unix”', () => {
    test('single line nodes', () => {
      expect(drawTestTree(tree, getTheme('unix'))).toBe(`
─a
 ├─b
 ├─c
 │ ├─d
 │ └─e
 └─f
   ├─g
   ├─h
   │ ├─i
   │ └─j
   └─k`)
    })

    test('multi line nodes', () => {
      const tree = branch('a1\na2', [
        of('b'),
        branch('c1\nc2', [of('d'), of('e1\ne2')]),
        branch('f', [of('g1\ng2')]),
      ])

      expect(drawTestTree(tree, getTheme('unix'))).toBe(`
─a1
 │a2
 ├─b
 ├─c1
 │ │c2
 │ ├─d
 │ └─e1
 │    e2
 └─f
   └─g1
      g2`)
    })
  })

  test('theme≔“unixRound”', () => {
    expect(drawTestTree(tree, getTheme('unixRound'))).toBe(`
─a
 ├─b
 ├─c
 │ ├─d
 │ ╰─e
 ╰─f
   ├─g
   ├─h
   │ ├─i
   │ ╰─j
   ╰─k`)
  })

  test('theme≔“thick”', () => {
    expect(drawTestTree(tree, getTheme('thick'))).toBe(`
┳a
┣━b
┣┳c
┃┣━d
┃┗━e
┗┳f
 ┣━g
 ┣┳h
 ┃┣━i
 ┃┗━j
 ┗━k`)
  })

  test('theme≔“space”', () => {
    expect(drawTestTree(tree, getTheme('space'))).toBe(`
 a
   b
   c
     d
     e
   f
     g
     h
       i
       j
     k`)
  })

  test('theme≔“bullets”', () => {
    expect(drawTestTree(tree, getTheme('bullets'))).toBe(`
 ∘a
   ∙b
   ∘c
     ∙d
     ∙e
   ∘f
     ∙g
     ∘h
       ∙i
       ∙j
     ∙k`)
  })

  test('theme≔“ascii”', () => {
    expect(drawTestTree(tree, getTheme('ascii'))).toBe(`
+a
+--b
+-+c
| +--d
| '--e
'-+f
  +--g
  +-+h
  | +--i
  | '--j
  '--k`)
  })
})

test('themedTree.unlines', () => {
  expect(
    '\n' +
      themedTree
        .unlines(getTheme('thin'))(from('a', of('b'), of('c')))
        .replaceAll(' ', '.'),
  ).toBe(`
┬a.
├─b
└─c`)
})

test('treeToPart.number', () => {
  const part = pipe(
    from(1, of(2), of(3)),
    pipe('thin', getTheme, treeToPart.number),
  )

  expect('\n' + drawPart.unlines(part).replaceAll(' ', '.')).toBe(`
┬1.
├─2
└─3`)
})
