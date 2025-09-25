# 🌳 effect-tree

A Typescript library for working with immutable trees.

1. [Synopsis](#synopsis)
2. [About](#about)
3. [Quick Start](#quick-start)
   1. [Install](#install)
   2. [Import](#import)
   3. [Create](#create)
   4. [Draw](#draw)
   5. [Operate](#operate)
4. [Dependencies](#dependencies)
5. [Not Ready Yet](#not-ready-yet)
6. [See Also](#see-also)
7. [Related](#related)

## Synopsis

```ts
import {from, of, drawTree} from 'effect-tree'

console.log(
  drawTree.doubleSpaceThin(
    from('Hello', from('World', of('🌳')))
  )
)
```

Prints:

```txt
─┬Hello
 │
 └─┬World
   │
   └──🌳
```

## About

1. The basic immutable generic data structure for encoding _generic eager trees_ with 0-n child nodes per branch, also called [Rose Trees](https://en.wikipedia.org/wiki/Rose_tree) and everything you need to efficiently query and operate on them.
1. Stack-safe [folds](https://github.com/middle-ages/effect-tree/blob/main/src/folds.ts)/[unfolds](https://github.com/middle-ages/effect-tree/blob/main/src/unfolds.ts), a [zipper](https://www.st.cs.uni-saarland.de/edu/seminare/2005/advanced-fp/docs/huet-zipper.pdf) for efficient traversal and update, and a [library of operations](https://github.com/middle-ages/effect-tree/blob/main/src/ops.ts) on trees, from [counting](https://github.com/middle-ages/effect-tree/blob/main/src/ops/counts.ts) to [zipping](https://github.com/middle-ages/effect-tree/blob/main/src/ops) and [zipping associatively](https://github.com/middle-ages/effect-tree/blob/main/src/ops/zipThese.ts).
1. [Encode/decode trees](https://middle-ages.github.io/effect-tree-docs/modules/Codec.html) into indented strings à la YAML, nested arrays, edge lists, path list of leaves, and [Prüfer codes](https://www.math.nagoya-u.ac.jp/~richard/teaching/s2024/SML_Tue_Tai_1.pdf).
1. Instances for [@effect/typeclass](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md) with [law tests](https://github.com/middle-ages/effect-tree/blob/main/src/instances/laws.test.ts).
1. [Draw themeable trees](https://github.com/middle-ages/effect-tree/blob/main/src/draw/tree.test.ts) on the terminal with support for multiline labels and [build your own layouts](https://github.com/middle-ages/effect-tree/blob/main/examples/layout.ts).
1. Testing helpers: Customizable [arbitraries](https://github.com/middle-ages/effect-tree/blob/main/src/arbitrary/Tree/options.ts) and functions to [enumerate labeled trees](https://github.com/middle-ages/effect-tree/blob/main/src/codec/prufer/enumerate.ts).

You can find [API documentation here](https://middle-ages.github.io/effect-tree-docs).

Read [here for more info](docs/features.md) on features, or just jump to the [pretty pictures](docs/features.md#drawing-trees) and proceed to [running the examples](examples/README.md).

## Quick Start

### Install

```sh
pnpm install effect-tree
```

### Import

Everything can be imported from the top level entry-point `effect-tree`:

```ts
import {type Tree, from, append, of, drawTree, Codec} from 'effect-tree'

const myLeaf = of('🍁')
console.log(drawTree.unlines(myLeaf))
// ─🍁

const helloThere: Tree<string> = from('hello', of('there'))
const world: Tree<string> = append(helloThere, of('world'))

const encoded = Codec.Indented.encode(world)
console.log(encoded.join('\n'))
// hello
//   there
//   world
```

### Create

You can create leaves and branches with functions like [of](https://middle-ages.github.io/effect-tree-docs/variables/index.of.html) and [from](https://middle-ages.github.io/effect-tree-docs/functions/index.from.html) that return the type [Tree](https://middle-ages.github.io/effect-tree-docs/types/effect-tree.Tree.html), functions like [branch](https://middle-ages.github.io/effect-tree-docs/functions/effect-tree.branch.html) and [leaf](https://middle-ages.github.io/effect-tree-docs/functions/effect-tree.leaf.html) that return [Branch](https://middle-ages.github.io/effect-tree-docs/types/effect-tree.Branch.html) and [Leaf](https://middle-ages.github.io/effect-tree-docs/types/effect-tree.Leaf.html), or use one of [the many combinators available](https://middle-ages.github.io/effect-tree-docs/modules/effect-tree.html) to build a tree in several steps.

You can unfold trees in various ways, decode trees from some encoded form, summon the n<sup>th</sup> tree from the enumeration of all _ordered labeled trees_, or generate random trees:

```ts
import {Arbitrary, type Tree, Codec, branch, leaf, nAryTree} from 'effect-tree'
import fc from 'fast-check'

// Manually
const myBranch = branch('1.', [leaf('2.1'), leaf('2.2')])

// Unfolding. Tree nodes will be set to node depth.
const myTernaryTree: Tree<number> = nAryTree({degree: 3, depth: 3})

// Decode from nested arrays.
const decodedTree: Tree<number> = Codec.Arrays.decode([1, [2, 3, [4, [5, 6]]]])

// Get the The 400,000,000,000,000th labeled tree with 16 nodes:
const enumeratedTree = Codec.Prufer.getNthTree(4e14, 16)

// Generate a tree using “fast-check”
const randomTree = fc.sample(
  Arbitrary.Tree.getArbitrary(fc.integer({min: 0, max: 10_000}), {
    branchBias: 1 / 4,
    maxDepth: 3,
    maxChildren: 5,
  }),
  {numRuns: 1, seed: 42},
)
```

### Draw

Draw themed trees to the terminal and compose custom layouts.

```ts
import {binaryTree, drawTree} from 'effect-tree'
import {pipe} from 'effect'

//                           A variant of “drawTree” that renders
//                           numeric trees into a string
//                                         ┊
//                             ╭┄┄┄┄┄┄┄┄┄┄┄┴┄┄┄┄┄┄┄┄┄┄┄╮
console.log(pipe(3, binaryTree, drawTree.number.unlines))
//┬1
//├┬2
//│├─3
//│└─3
//└┬2
// ├─3
// └─3
```

### Operate

For example with a zipper:

```ts
import {leaf, binaryTree, drawTree, Zipper} from 'effect-tree'
import {pipe} from 'effect'

console.log(
  pipe(
    3,
    binaryTree,
    Zipper.fromTree,
    Zipper.head,
    Zipper.head,
    Zipper.replace(leaf(42)),
    Zipper.toTree,
    drawTree.unixRound.number.unlines,
  ),
)
// ─1
//  ├─2
//  │ ├─42 ← replaced
//  │ ╰─3
//  ╰─2
//    ├─3
//    ╰─3
```

## Dependencies

1. [effect](https://www.npmjs.com/package/effect)
1. [@effect/typeclass](https://www.npmjs.com/package/@effect/typeclass)
1. [effect-ts-folds](https://github.com/middle-ages/effect-ts-folds)
1. [tty-strings](https://www.npmjs.com/package/tty-strings)

## Not Ready Yet

1. More examples in API documentation.
1. Effect.Schema codec.
1. Folds for collecting tree metrics.
1. A lazy version where the Branch.forest field is not an array but a stream.
1. Playground.

## See Also

1. [API Documentation](https://middle-ages.github.io/effect-tree-docs)
1. [Examples README](examples/README.md)
1. [Codecs module README](src/codec/README.md)
1. [Draw module README](src/draw/README.md)
1. [List of features](docs/features.md)

## Related

1. [fp-ts tree](https://gcanti.github.io/fp-ts/modules/Tree.ts.html)
1. [recursion schemes](https://hackage.haskell.org/package/recursion-schemes)
1. [effect-ts-laws](https://middle-ages.github.io/effect-ts-laws-docs/catalog-of-laws.html)
   is used for law testing.
