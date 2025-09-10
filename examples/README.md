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

| Example                                                                                | Note                                                                     |
|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [Basic](https://github.com/middle-ages/effect-tree/blob/main/examples/basic.ts)        | Create a tree, add/remove nodes, and other basic use-cases.              |
| [Draw](https://github.com/middle-ages/effect-tree/blob/main/examples/draw.ts)          | Draw trees in various themes.                                            |
| [Fibonacci](https://github.com/middle-ages/effect-tree/blob/main/examples/fibonacci.ts)| A custom fold: unfold the Fibonacci sequence into a linear tree.         |
| [Folds](https://github.com/middle-ages/effect-tree/blob/main/examples/folds.ts)        | Fusing folds into tuples and structs.                                    |
| [Genealogy](https://github.com/middle-ages/effect-tree/blob/main/examples/genealogy.ts)| Level labels, bottom grounded subtrees, and encoding to indented strings.|
