# effect-tree User Guide

<h1><font color=red>NOT READY YET</font></h1>

## Creating

### Building from Code

- tree
- branch
- leaf
- from
- of
- withForest

### Decoding from Data

- Edge list
- Nested arrays
- Indented strings
- Prüfer codes
- Path list

### Unfold from Functions

- unfoldLevelTree
- byParentUnfold

## Decoding from Data

## Basic Operations

- isLeaf
- isBranch
- length
- getValue
- getBranchForest
- getForest
- destruct
- destructBranch
- setValue
- setForest
- modBranch
- modValue
- modForest
- modBranchForest
- firstChild
- lastChild
- nthChild
- drill
- insertAllAt
- insertAt
- append
- prepend
- appendAll
- prependAll
- removeForest
- removeNthChild
- removeFirstChild
- removeLastChild
- sliceForest

### Zipper

- fromTree
- toTree

#### Navigate

- head
- last
- previous
- next
- up
- at

#### Modify

- replace
- insert
- add

## Folds

## Unfolds

## Operations

- counts
  - countOf
  - nodeCount
  - maximumNodeHeight
  - maximumNodeDegree
  - nodeCountAtLeast
- filters
  - includes
  - filterMinimumLeaf
  - filterNodes
  - filterLeaves
  - filterLeaves
- levels
  - unfoldLevelTree
  - annotateDepth
  - addLevelLabels
  - cropDepth
  - growTree
  - binaryTree
- numeric
  - sum
  - multiply
  - max
  - min
  - average
- order
  - minimumNode
  - maximumNode
  - minimumLeaf
  - maximumLeaf
  - minimumLeafAndParent
  - maximumLeafAndParent
- ordinal
  - asOrdinal
    - asOrdinal.post
  - asOrdinalBranch
    - asOrdinalBranch.post  
  - withOrdinal
    - withOrdinal.post  
- subtrees
  - bottomSubtrees
- traverse
  - breadthOrderValues
  - allLeaves
  - preOrderValues
  - postOrderValues
- zip
  - zipWith
  - zip
  - unzip
- zipThese
  - zipTheseWith
  - zipThese
  - unzipThese

## Drawing

### Themes

- ascii
- bullets
- rounded
- space
- thick
- doubleSpaceThin
- thin
- unix
- unixRounded
