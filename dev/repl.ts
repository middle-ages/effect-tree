import * as Function from '#util/Function'
import * as String from '#util/String'
import * as Effect from 'effect'
import * as Tree from '../index.js'

import {from, of} from '../index.js'

const drawTree = Tree.drawTree

const demoTree = from(
  '💡Demo Tree',
  from('🟣 Small', from('⭕ Insects', of('🦋')), of('🦠Microbe')),
  from('🔵 Big', of('🦌'), of('🦍'), of('🐘')),
  from(
    '🌊 The Sea',
    of('🚣 Row Boat'),
    of('⛵ Sail Boat'),
    from('🟢 Mammals', of('🐋'), of('🐬'), of('🦦'), of('🦭')),
    from('🔴Crustaceans', of('🦐 Shrimp'), of('🦀 Crab'), of('🦞 Lobster')),
  ),
)

// Draw a tree to the REPL console.
const draw = (tree: Tree.Tree<string> | Tree.Tree<number>): void => {
  console.debug(
    isNumericTree(tree)
      ? drawTree.number.unlines(tree)
      : drawTree.unlines(tree),
  )
}

const help = `» Loaded “dev/repl.ts”.

• .help............Node.js help        ┳━┏━┏━┏━▗━▖╺┳━ ━┳╸┳━▖┏━┏━  ┳━▖┏━┏━▖┳🍁
• help.............help                ┣╸┣╸┣╸┣╸┃   ┃╺━╸┃ ┣┳┛┣╸┣╸  ┣┳┛┣╸┣━┛┃
• _................previous result     ┗━╹ ╹ ┗━▝━▘ ╹   ╹ ╹▝╸┗━┗━  ╹▝╸┗━╹  ┗━╸
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
`

function isNumericTree(
  tree: Tree.Tree<string> | Tree.Tree<number>,
): tree is Tree.Tree<number> {
  const headValue: string | number = Tree.getValue<string | number>(
    tree as Tree.Tree<string | number>,
  )
  return Effect.Predicate.isNumber(headValue)
}

Object.assign(globalThis, {
  ...Function,
  ...Tree,
  demoTree,
  effect: Effect,
  unlines: String.unlines,
  string: String,
  draw,
})

Object.defineProperty(globalThis, 'help', {
  get: function () {
    console.log(help)
    return ''
  },
  configurable: true,
  enumerable: true,
})

console.log(help)
