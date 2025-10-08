import {Prufer} from '#codec'
import {drawTree} from '#test'
import {branch, from, map, of} from '#tree'
import {Array, pipe} from 'effect'
import {describe, expect, test} from 'vitest'
import {
  isFirstCode,
  nextTree,
  nextTreeWrap,
  previousTree,
  previousTreeWrap,
} from './step.js'

test('codeCount', () => {
  expect(Prufer.codeCount(4)).toBe(2)
})

test('isFirstCode', () => {
  expect(isFirstCode([])).toBe(true)
})

describe('labeledTreeCount', () => {
  test('2', () => {
    expect(Prufer.labeledTreeCount(2)).toEqual(1n)
  })

  test('3', () => {
    expect(Prufer.labeledTreeCount(3)).toEqual(3n)
  })

  test('4', () => {
    expect(Prufer.labeledTreeCount(4)).toEqual(16n)
  })
})

describe('getLastCodeFor', () => {
  test('2', () => {
    expect(Prufer.getLastCodeFor(2)).toEqual([])
  })

  test('3', () => {
    expect(Prufer.getLastCodeFor(3)).toEqual([3])
  })
})

describe('getFirstCodeFor', () => {
  test('2', () => {
    expect(Prufer.getFirstCodeFor(2)).toEqual([])
  })

  test('3', () => {
    expect(Prufer.getFirstCodeFor(3)).toEqual([1])
  })

  test('5', () => {
    expect(Prufer.getFirstCodeFor(5)).toEqual([1, 1, 1])
  })
})

describe('nextCode', () => {
  describe('nodeCount≔2', () => {
    test('n≔1', () => {
      expect(Prufer.nextCode([])).toEqual([1])
    })
  })

  describe('nodeCount≔3', () => {
    test('n≔1', () => {
      expect(Prufer.nextCode([1])).toEqual([2])
    })
    test('n≔2', () => {
      expect(Prufer.nextCode([2])).toEqual([3])
    })
    test('n≔3', () => {
      expect(Prufer.nextCode([3])).toEqual([1, 1])
    })
  })

  describe('nodeCount≔4', () => {
    test('code≔[1,1]', () => {
      expect(Prufer.nextCode([1, 1])).toEqual([1, 2])
    })
    test('code≔[1,4]', () => {
      expect(Prufer.nextCode([1, 4])).toEqual([2, 1])
    })
    test('code≔[4,4]', () => {
      expect(Prufer.nextCode([4, 4])).toEqual([1, 1, 1])
    })
  })
})

describe('previousCode', () => {
  describe('nodeCount≔2', () => {
    test('n≔1', () => {
      expect(Prufer.previousCode([])).toEqual([])
    })
  })

  describe('nodeCount≔3', () => {
    test('n≔1', () => {
      expect(Prufer.previousCode([1])).toEqual([])
    })

    test('n≔2', () => {
      expect(Prufer.previousCode([2])).toEqual([1])
    })

    test('n≔3', () => {
      expect(Prufer.previousCode([3])).toEqual([2])
    })
  })

  describe('nodeCount≔4', () => {
    test('n≔1', () => {
      expect(Prufer.previousCode([1, 1])).toEqual([3])
    })
  })

  describe('nodeCount≔5', () => {
    test('n≔1', () => {
      expect(Prufer.previousCode([1, 1, 1])).toEqual([4, 4])
    })
    test('n≔2', () => {
      expect(Prufer.previousCode([1, 1, 2])).toEqual([1, 1, 1])
    })
  })
})

describe('fromOrdinal', () => {
  test('nodeCount≔2', () => {
    expect(Prufer.fromOrdinal(1n, 2)).toEqual([])
  })

  describe('nodeCount≔3', () => {
    const iut = (n: bigint) => Prufer.fromOrdinal(n, 3)

    test('n≔1', () => {
      expect(iut(1n)).toEqual([1])
    })
    test('n≔2', () => {
      expect(iut(2n)).toEqual([2])
    })
    test('n≔3', () => {
      expect(iut(3n)).toEqual([3])
    })
  })

  describe('allCodesAt', () => {
    test('nodeCount≔2', () => {
      expect(Prufer.allCodesAt(2)).toEqual([[]])
    })

    test('nodeCount≔4', () => {
      const range = Array.range(1, 4)
      const expected = Array.cartesian(range, range)

      expect(Prufer.allCodesAt(4)).toEqual(expected)
    })
  })
})

describe('toOrdinal', () => {
  test('nodeCount≔2', () => {
    expect(Prufer.toOrdinal([])).toEqual([1n, 2])
  })

  describe('nodeCount≔3', () => {
    const iut = Prufer.toOrdinal
    test('n≔1', () => {
      expect(iut([1])).toEqual([1n, 3])
    })
    test('n≔2', () => {
      expect(iut([2])).toEqual([2n, 3])
    })
    test('n≔3', () => {
      expect(iut([3])).toEqual([3n, 3])
    })
  })

  describe('nodeCount≔4', () => {
    const iut = Prufer.toOrdinal
    test('n≔1', () => {
      expect(iut([1, 1])).toEqual([1n, 4])
    })
    test('n≔16', () => {
      expect(iut([4, 4])).toEqual([16n, 4])
    })
  })
})

describe('treeToOrdinal', () => {
  const iut = Prufer.treeToOrdinal
  test('nodeCount≔2', () => {
    expect(iut(branch(1, [of(2)]))).toEqual([1n, 2])
  })

  describe('nodeCount≔3', () => {
    test('n≔1', () => {
      expect(iut(branch(1, [of(2), of(3)]))).toEqual([1n, 3])
    })
    test('n≔2', () => {
      expect(iut(branch(2, [of(1), of(3)]))).toEqual([2n, 3])
    })
    test('n≔3', () => {
      expect(iut(branch(3, [of(1), of(2)]))).toEqual([3n, 3])
    })
  })

  describe('nodeCount≔5', () => {
    test('n≔1', () => {
      expect(iut(branch(1, [of(2), of(3), of(4), of(5)]))).toEqual([1n, 5])
    })
    test('n≔5⁵⁻²', () => {
      expect(iut(branch(5, [of(1), of(2), of(3), of(4)]))).toEqual([
        5n ** (5n - 2n),
        5,
      ])
    })
  })
})

describe('previousCodeWrap', () => {
  const branchLabel = (code: number[]): string =>
    '“' + code.map(s => s.toString()).join(', ') + '”'

  const testPrevious = (code: number[], expected: number[]) => {
    test(branchLabel(code) + ' - 1 = ' + branchLabel(expected), () => {
      expect(Prufer.previousCodeWrap(code)).toEqual(expected)
    })
  }

  describe('nodeCount≔2', () => {
    testPrevious([], [])
  })

  describe('nodeCount≔3', () => {
    testPrevious([1], [3])
    testPrevious([2], [1])
    testPrevious([3], [2])
  })

  describe('nodeCount≔4', () => {
    testPrevious([1, 1], [4, 4])
    testPrevious([4, 1], [3, 4])
    testPrevious([4, 3], [4, 2])
    testPrevious([4, 4], [4, 3])
  })
})

describe('nextCodeWrap', () => {
  const branchLabel = (code: number[]): string =>
    '“' + code.map(s => s.toString()).join(', ') + '”'

  const testNext = (code: number[], expected: number[]) => {
    test(branchLabel(code) + ' + 1 = ' + branchLabel(expected), () => {
      expect(Prufer.nextCodeWrap(code)).toEqual(expected)
    })
  }

  describe('nodeCount≔2', () => {
    testNext([], [])
  })

  describe('nodeCount≔3', () => {
    testNext([1], [2])
    testNext([2], [3])
    testNext([3], [1])
  })

  describe('nodeCount≔4', () => {
    testNext([1, 1], [1, 2])
    testNext([4, 1], [4, 2])
    testNext([4, 3], [4, 4])
    testNext([4, 4], [1, 1])
  })
})

describe('allTreesAt', () => {
  test('nodeCount≔1', () => {
    expect(Prufer.allTreesAt(1)).toEqual([])
  })

  test('nodeCount≔2', () => {
    expect(Prufer.allTreesAt(2)).toEqual([branch(1, [of(2)])])
  })

  test('nodeCount≔3', () => {
    expect(Prufer.allTreesAt(3)).toEqual([
      branch(1, [of(2), of(3)]),
      branch(1, [branch(2, [of(3)])]),
      branch(1, [branch(3, [of(2)])]),
    ])
  })
})

describe('getNthTree', () => {
  const drawNthTree = (ordinal: bigint, nodeCount: number) =>
    pipe(
      Prufer.getNthTree(ordinal, nodeCount),
      map(s => s.toString()),
      drawTree,
    )

  test('nodeCount:=2', () => {
    expect(drawNthTree(1n, 2)).toBe(
      `
┬1
└─2`,
    )
  })

  test('nodeCount:=3', () => {
    expect(drawNthTree(1n, 3)).toBe(
      `
┬1
├─2
└─3`,
    )
  })

  test('nodeCount:=5', () => {
    expect(drawNthTree(5n ** (5n - 2n), 5)).toBe(
      `
┬1
└┬5
 ├─2
 ├─3
 └─4`,
    )
  })
})

test('previousTree', () => {
  expect(previousTree(branch(1, [of(2), of(3)]))).toEqual(branch(1, [of(2)]))
})

test('nextTree', () => {
  expect(nextTree(branch(1, [of(2), of(3)]))).toEqual(from(1, from(2, of(3))))
})

test('previousTreeWrap', () => {
  expect(previousTreeWrap(branch(1, [of(2), of(3)]))).toEqual(
    branch(1, [branch(3, [of(2)])]),
  )
})

test('nextTreeWrap', () => {
  expect(nextTreeWrap(branch(1, [of(2), of(3)]))).toEqual(
    from(1, from(2, of(3))),
  )
})
