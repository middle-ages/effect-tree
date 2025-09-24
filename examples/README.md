# Examples

## Running

### Stackblitz

Has [containers ready to run](https://stackblitz.com/~/github.com/middle-ages/effect-tree) the examples.

### Locally

You can run the examples locally using [tsx](https://www.npmjs.com/package/tsx). For example to run the `basic` example clone this repository, install tsx, and use it to launch the example:

```sh
git clone git@github.com:middle-ages/effect-tree.git
cd effect-tree
pnpm i
pnpm tsx examples/basic.ts
```

### Browsing

The expected terminal output of each example appears inline with the source code.

| Example                                                                                 | Note                                                                      |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Basic](https://github.com/middle-ages/effect-tree/blob/main/examples/basic.ts)         | Create a tree, add/remove nodes, and other basic use-cases.               |
| [Codecs](https://github.com/middle-ages/effect-tree/blob/main/examples/codecs.ts)       | Encode/decode the same tree through all codecs.                           |
| [Draw](https://github.com/middle-ages/effect-tree/blob/main/examples/draw.ts)           | Draw trees in various themes.                                             |
| [Fibonacci](https://github.com/middle-ages/effect-tree/blob/main/examples/fibonacci.ts) | A custom fold: unfold the Fibonacci sequence into a linear tree.          |
| [Folds](https://github.com/middle-ages/effect-tree/blob/main/examples/folds.ts)         | Fusing folds into tuples and structs.                                     |
| [Genealogy](https://github.com/middle-ages/effect-tree/blob/main/examples/genealogy.ts) | Level labels, bottom grounded subtrees, and encoding to indented strings. |
| [Generate](https://github.com/middle-ages/effect-tree/blob/main/examples/generate.ts)   | Enumerate and generate trees.                                             |
| [Layout](https://github.com/middle-ages/effect-tree/blob/main/examples/layout.ts)       | Alternate tree layouts using the `Draw` module.                           |
| [Nary](https://github.com/middle-ages/effect-tree/blob/main/examples/nary.ts)           | N-ary trees: trees with a fixed degree.                                   |
| [Zipper](https://github.com/middle-ages/effect-tree/blob/main/examples/zipper.ts)       | Use a zipper to navigate and change trees.                                |

### REPL

Inside the repository `pnpm repl` (or `tsx dev/repl.ts`) will run the [Node.js REPL](https://nodejs.org/api/repl.html) with symbols useful for
quick experimentation [added to the global scope](https://github.com/middle-ages/effect-tree/blob/main/dev/repl.ts).

Type `help` for more info. You should see this:

```txt
> tsx --import=./dev/repl.ts
» Loaded “dev/repl.ts”.

• .help............Node.js help
• help.............this help message
• _................previous result
• demoTree.........a small tree of strings
• getValue(tree)...get root node value
• draw(tree).......draw string or numeric tree to console
• of('hello')......create leaf from value
• from(............create tree from value and possibly empty tree list
       'root',
       of('leaf₁'),                               •┬─root
       from('branch', of('leaf₂'), of('leaf₃')) ┄→ ├───leaf₁
      )      ┊    ┊  ┊                        ┊    └─┬─branch
             ╰┄┬┄┄╯  ╰┄┄┄┄┄┄┄┄┄┄┬┄┄┄┄┄┄┄┄┄┄┄┄┄╯      └─┬─leaf₂
  branch value┄╯                ╰┄list of leaves       └─leaf₃

Try: > draw(demoTree)                  Global namespace:
     > pipe(8, binaryTree, draw)       ‣ effect exports under “effect”
                                       ‣ effect/Function exports
                                       ‣ effect-tree exports

Welcome to Node.js v22.14.0.
Type ".help" for more information.
>
```

Here is a screenshot of REPL run:

![REPL Run](docs/repl.png)
