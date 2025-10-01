import {NodeContext, NodeRuntime} from '@effect/platform-node'
import {Effect, pipe} from 'effect'
import {drawTree, FileSystem, map} from 'effect-tree'

// Read the ‘src/draw/tree’ directory into a tree.
const treeEffect = pipe(
  'src/draw/tree',
  FileSystem.readDirectoryTree,

  // Convert the directory entries to strings
  Effect.map(map(({name}: FileSystem.DirectoryEntry) => name)),

  Effect.tap(tree => {
    console.log(drawTree.unlines(tree))
  }),
)

NodeRuntime.runMain(Effect.provide(NodeContext.layer)(treeEffect))

/*
┬src/draw/tree
├─atoms.test.ts
├─atoms.ts
├─draw.ts
├─layout.ts
├┬theme
│├─data.test.ts
│├─data.ts
│├─glyph.ts
│├─ops.test.ts
│├─ops.ts
│└─themes.ts
└─theme.ts
*/
