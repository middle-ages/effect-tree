# effect-ts-tree

# TO BE RELEASED SOON

A Typescript library for working with trees.

1. [About](#about)
1. [Dependencies](#dependencies)
1. [Not Ready Yet](#not-ready-yet)
1. [See Also](#see-also)

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
1. Stack-safe [folds](src/folds.ts)/[unfolds](src/unfolds.ts), and a [library of operations](src/ops.ts) on trees, from [counting](src/ops/counts.ts) to [zipping](src/ops/zip.ts).
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

You can create leaves and branches with the functions [leaf]() and [branch]()

```ts
import {Tree, branch, leaf} from 'effect-tree

const myBranch: Tree<string> = branch(
  'root branch', [
    leaf('hello'),
    leaf('world'),
  ]
)
```

Other ways to create trees:

1. **Building from code** Functions like [tree](https://middle-ages.github.io/effect-tree-docs/functions/index.tree.html), [branch](https://middle-ages.github.io/effect-tree-docs/functions/index.tree.html), [from](https://middle-ages.github.io/effect-tree-docs/functions/index.tree.html), [of](https://middle-ages.github.io/effect-tree-docs/functions/index.tree.html) (and alias for [leaf](https://middle-ages.github.io/effect-tree-docs/functions/index.tree.html)), [withForest](https://middle-ages.github.io/effect-tree-docs/functions/index.tree.html) are versions of the basic [branch](https://middle-ages.github.io/effect-tree-docs/functions/index.branch.html) and [leaf](https://middle-ages.github.io/effect-tree-docs/functions/index.branch.html) functions, specialized for composing tree building pipelines.
1. **Decoding from data** Decode trees from common encodings: [edge lists](https://middle-ages.github.io/effect-tree-docs/), [nested arrays](https://middle-ages.github.io/effect-tree-docs/), [indented strings](https://middle-ages.github.io/effect-tree-docs/), [Prüfer codes](https://middle-ages.github.io/effect-tree-docs/), and a [list of tree paths](https://middle-ages.github.io/effect-tree-docs/).

1. **Unfold with unfolding functions** . Functions like [unfoldLevelTree](src/ops/levels.ts#L158) unfold trees using functions for [unfolding a single level of tree](src/unfolds.ts).

* Draw

```ts
import {Tree, binaryTree, drawTree, map} from 'effect-tree'
import {pipe} from 'effect'

console.log(
  pipe(
    3,
    binaryTree,
    map(s => s.toString()),
    drawTree,
  )
)
//┬1
//├┬2
//│├─3
//│└─3
//└┬2
// ├─3
// └─3
```

* Operate

## Dependencies

1. [@effect/typeclass](https://www.npmjs.com/package/@effect/typeclass)
1. [effect](https://www.npmjs.com/package/effect)
1. [effect-ts-folds](https://github.com/middle-ages/effect-ts-folds)
1. [tty-strings](https://www.npmjs.com/package/tty-strings)

## Not Ready Yet

1. Zipper feature.
1. Api docs.
1. More examples.
1. Effect.Schema codec.
1. Folds for collecting tree metrics.

## See Also

1. [API Documentation](https://middle-ages.github.io/effect-tree-docs)
1. [Examples folder](https://middle-ages.github.io/effect-tree/blob/main/examples)
1. [Users guide](https://middle-ages.github.io/effect-tree/blob/main/docs/user-guide.md)
1. [List of features](https://middle-ages.github.io/effect-tree/blob/main/docs/features.md)

## Related

1. [fp-ts tree](https://gcanti.github.io/fp-ts/modules/Tree.ts.html)
1. [recursion schemes](https://hackage.haskell.org/package/recursion-schemes)
1. [effect-ts-laws](https://middle-ages.github.io/effect-ts-laws-docs/catalog-of-laws.html)
   is used for law testing.
