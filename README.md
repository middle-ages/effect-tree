# 🌳 effect-tree

<b><font color=red>NOT RELEASED YET</font></b>

A Typescript library for working with trees.

1. [Synopsis](#about)
1. [About](#about)
1. [Quick Start](#about)
1. [Dependencies](#dependencies)
1. [Not Ready Yet](#not-ready-yet)
1. [See Also](#see-also)
1. [Related](#related)

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
1. Stack-safe [folds](src/folds.ts)/[unfolds](src/unfolds.ts), a [zipper](https://en.wikipedia.org/wiki/Zipper_(data_structure)) and a [library of operations](src/ops.ts) on trees, from [counting](src/ops/counts.ts) to [zipping](src/ops/zip.ts).
1. [Encode/decode trees](src/codec.ts) into indented strings à la YAML, nested arrays, edge lists, path lists, and [Prüfer codes](https://en.wikipedia.org/wiki/Pr%C3%BCfer_sequence).
1. Instances for [@effect/typeclass](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md) with [law tests](src/instances/laws.test.ts).
1. [Draw themeable trees](src/draw/tree.test.ts) on the terminal with support for multiline labels.
1. Testing helpers: Customizable [arbitraries](src/arbitrary/Tree/options.ts) and functions to [enumerate labeled trees](src/codec/prufer/enumerate.ts).

You can find [API documentation here](https://middle-ages.github.io/effect-tree-docs).

Read [here for more info](https://github.com/middle-ages/effect-tree/blob/main/docs/features.md) on features.

## Quick Start

* Install

```sh
pnpm install effect-tree
```

* Import

Everything can be imported from the top level entry-point.

```ts
import {leaf, type Tree} from 'effect-tree

const myLeaf: Tree<string> = leaf('hello')
```

* Create

You can create leaves and branches with functions like [of](https://middle-ages.github.io/effect-tree-docs/variables/index.of.html) and
[from](https://middle-ages.github.io/effect-tree-docs/functions/index.from.html):

```ts
import {Tree, from, of} from 'effect-tree

const myBranch: Tree<string> = from( 'root branch', of('hello'), of('world'))
```

* Draw

```ts
import {Tree, binaryTree, drawTree} from 'effect-tree'
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

* Operate

```ts
import {Tree, binaryTree, drawTree, Zipper} from 'effect-tree'
import {pipe} from 'effect'

console.log(
  pipe(
    3,
    binaryTree,
    Zipper.fromTree,
    Zipper.unsafeHead,
    Zipper.unsafeHead,
    Zipper.replace(42),
    Zipper.toTree,
    drawTree.unixRounded.number.unlines,
  )
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

1. [@effect/typeclass](https://www.npmjs.com/package/@effect/typeclass)
1. [effect](https://www.npmjs.com/package/effect)
1. [effect-ts-folds](https://github.com/middle-ages/effect-ts-folds)
1. [tty-strings](https://www.npmjs.com/package/tty-strings)

## Not Ready Yet

1. Add zipper API sugar, repeatWhile/until, find.
1. Effect.Schema codec.
1. Folds for collecting tree metrics.
1. A lazy version where the Branch.forest field is not an array but a stream.

## See Also

1. [API Documentation](https://middle-ages.github.io/effect-tree-docs)
1. [Examples folder](https://middle-ages.github.io/effect-tree/blob/main/examples)
1. [Codecs readme](https://middle-ages.github.io/effect-tree/blob/main/src/codec/README.md)
1. [List of features](https://middle-ages.github.io/effect-tree/blob/main/docs/features.md)

## Related

1. [fp-ts tree](https://gcanti.github.io/fp-ts/modules/Tree.ts.html)
1. [recursion schemes](https://hackage.haskell.org/package/recursion-schemes)
1. [effect-ts-laws](https://middle-ages.github.io/effect-ts-laws-docs/catalog-of-laws.html)
   is used for law testing.
