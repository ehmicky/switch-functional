import test from 'ava'
import { each } from 'test-each'

import switchFunctional from 'switch-functional'

each(
  [
    [1, true, true],
    [1, true, false],
    [1, false, true],
    [2, false, false],
    [1, () => false, true],
  ] as const,
  ({ title }, [expectedReturn, ...conditions]) => {
    test(`Can match array conditions | ${title}`, (t) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      t.is(switchFunctional(0).case(conditions, 1).default(2), expectedReturn)
    })
  },
)

each(
  [
    [1, () => true],
    [2, () => false],
  ] as const,
  ({ title }, [expectedReturn, condition]) => {
    test(`Can match function conditions | ${title}`, (t) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      t.is(switchFunctional(0).case(condition, 1).default(2), expectedReturn)
    })
  },
)

const symbolOne = Symbol('one')
const symbolTwo = Symbol('two')

each(
  [
    [0, 0],
    [0n, 0n],
    ['', ''],
    ['.', '.'],
    [true, true],
    [symbolOne, symbolOne],
    [null, null],
    [undefined, undefined],
    [[], [[]]],
    [[0], [[0]]],
    [[0, 1], [[0, 1]]],
    [[{ one: 0 }], [[{ one: 0 }]]],
    [[[0]], [[[0]]]],
    [{}, {}],
    [{ one: 1 }, {}],
    [{ one: 1 }, { one: 1 }],
    [{ one: { two: 1 } }, { one: { two: 1 } }],
    [{ one: [1] }, { one: [1] }],
  ] as const,
  ({ title }, [input, condition]) => {
    test(`Can match equality conditions | ${title}`, (t) => {
      t.is(switchFunctional(input).case(condition, 1).default(2), 1)
    })
  },
)

each(
  [
    [0, 1],
    [0, -0],
    [0, 0n],
    [0, '0'],
    [0n, 1n],
    ['', '.'],
    ['.', '. '],
    [symbolOne, symbolTwo],
    [null, undefined],
    [0, {}],
    [{}, 0],
    [0, [[]]],
    [[], 0],
    [[], {}],
    [{}, [[]]],
    [[], [[0]]],
    [[0], [[]]],
    [[0], [[0, 1]]],
    [[0, 1], [[0]]],
    [[0], [[1]]],
    [[{ one: 0 }], [[{ one: 1 }]]],
    [[[0]], [[[1]]]],
    [{}, { one: 1 }],
    [{ one: 1 }, { one: 2 }],
    [{ one: { two: 1 } }, { one: { two: 2 } }],
    [{ one: [1] }, { one: [2] }],
  ] as const,
  ({ title }, [input, condition]) => {
    test(`Can not match equality conditions | ${title}`, (t) => {
      t.is(switchFunctional(input).case(condition, 1).default(2), 2)
    })
  },
)

test('options.mapCondition() can use booleans', (t) => {
  t.is(
    switchFunctional(0, {
      mapCondition: (condition: number) => condition === 2,
    })
      .case(1, '1')
      .case(2, '2')
      .default('3'),
    '2',
  )
})

test('options.mapCondition() can return a function', (t) => {
  t.is(
    switchFunctional(0, {
      mapCondition: (condition: number) => (value: number) =>
        condition === value + 2,
    })
      .case(1, '1')
      .case(2, '2')
      .default('3'),
    '2',
  )
})

test('options.mapCondition() works with arrays', (t) => {
  t.is(
    switchFunctional(0, {
      mapCondition: (condition: number) => condition === 2,
    })
      .case([0, 1], '1')
      .case([2, 3], '2')
      .default('3'),
    '2',
  )
})

test('options.mapCondition() can use deep equality', (t) => {
  t.is(
    switchFunctional(
      { prop: 0 },
      {
        mapCondition: (condition: number) => ({ prop: condition }),
      },
    )
      .case(1, '1')
      .case(0, '2')
      .default('3'),
    '2',
  )
})
