import {Path, FileSystem as PlatformFileSystem} from '@effect/platform'
import {NodeContext, NodeRuntime} from '@effect/platform-node'
import {PlatformError} from '@effect/platform/Error'
import {Effect, flow, pipe, type Scope} from 'effect'
import {
  drawTree,
  FileSystem,
  filterLeaves,
  leaf,
  map,
  match,
  type Tree,
  tree,
} from 'effect-tree'

type DirectoryEffect = Effect.Effect<
  Tree<string>,
  PlatformError,
  PlatformFileSystem.FileSystem | Path.Path | Scope.Scope
>

// Read the ‘src/draw/tree’ directory into a tree.
const withFiles: DirectoryEffect = pipe(
  'src/draw/tree',
  FileSystem.readDirectoryTree,

  // Convert the directory entries to strings by mapping over our tree.
  Effect.map(map(({name}: FileSystem.DirectoryEntry) => name)),
  tapDraw,
)

// Run the withFiles effect.
runInNodeContext(withFiles)

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

// Read the same folder but filter away the files leaving only directories.
const noFiles: DirectoryEffect = pipe(
  'src/draw/tree',
  FileSystem.readDirectoryTree,

  // Filter only the directories and extract the path.
  Effect.map(
    flow(
      filterLeaves(({type}) => type === 'Directory'),
      map(({name}) => name),
    ),
  ),
  tapDraw,
)

// Run the noFiles effect.
runInNodeContext(noFiles)

/*
┬tree
└─theme
*/

// Write the directory tree to a scoped temporary directory.
const makeDirectory: DirectoryEffect = Effect.gen(function* () {
  const fs = yield* PlatformFileSystem.FileSystem

  const tempPath = yield* fs.makeTempDirectoryScoped({
    prefix: 'directory-tree-example-',
    directory: import.meta.dirname,
  })

  // Root our tree in the temporary directory
  const tempNoFiles: Tree<string> = tree(tempPath, [
    tree('tree', [leaf('theme')]),
  ])

  // Write the tree to disk.
  yield* FileSystem.writeDirectoryTree(tempNoFiles)

  // Now read it back.
  return yield* pipe(
    tempPath,
    FileSystem.readDirectoryTree,
    Effect.map(map(({name}) => name)),

    // Remove the temporary directory we added as root.
    Effect.map(
      match({
        onLeaf: leaf,
        onBranch: (_, [head]) => head,
      }),
    ),

    tapDraw,
    Effect.scoped,
  )
})

// Run the makeDirectory effect.
runInNodeContext(makeDirectory)

/*
┬tree
└─theme
*/

function runInNodeContext(effect: DirectoryEffect) {
  pipe(
    effect,
    Effect.scoped,
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain,
  )
}

function tapDraw(effect: DirectoryEffect): typeof effect {
  return Effect.tap(effect, tree => {
    console.log(drawTree.unlines(tree))
  })
}
