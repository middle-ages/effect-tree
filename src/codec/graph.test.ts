import {numericTree} from '#test'
import {expect, test} from 'vitest'
import {treeToGraphViz} from './graph.js'

test('treeToGraphViz', () => {
  const graphviz = treeToGraphViz(numericTree)
  expect('\n' + graphviz).toBe(`
digraph G {
  "0" [label="1"];
  "1" [label="2"];
  "2" [label="3"];
  "3" [label="4"];
  "4" [label="5"];
  "5" [label="6"];
  "6" [label="7"];
  "7" [label="8"];
  "8" [label="11"];
  "9" [label="9"];
  "10" [label="10"];
  "1" -> "0" [label=""];
  "2" -> "1" [label=""];
  "3" -> "1" [label=""];
  "4" -> "1" [label=""];
  "5" -> "0" [label=""];
  "6" -> "5" [label=""];
  "7" -> "5" [label=""];
  "8" -> "5" [label=""];
  "9" -> "8" [label=""];
  "10" -> "0" [label=""];
}`)
})
