import test from 'ava'
import { each } from 'test-each'

import switchFunctional from 'switch-functional'

const noop = () => {}

const getStub = <T>(value: T) => {
  const state = { called: false, lastArgument: undefined as unknown }
  return {
    state,
    stub: (lastArgument: unknown) => {
      state.called = true
      state.lastArgument = lastArgument
      return value
    },
  }
}

test('0 cases', (t) => {
  t.is(switchFunctional(0).default(1), 1)
})

test('1 case, matched', (t) => {
  t.is(switchFunctional(0).case(true, 1).default(2), 1)
})

test('1 case, not matched', (t) => {
  t.is(switchFunctional(0).case(false, 1).default(2), 2)
})

test('2 cases, first matched', (t) => {
  t.is(switchFunctional(0).case(true, 1).case(false, 2).default(3), 1)
})

test('2 cases, second matched', (t) => {
  t.is(switchFunctional(0).case(false, 1).case(true, 2).default(3), 2)
})

test('2 cases, not matched', (t) => {
  t.is(switchFunctional(0).case(false, 1).case(false, 2).default(3), 3)
})

test('Does not call default if already matched', (t) => {
  const { stub, state } = getStub(2)
  t.is(switchFunctional(0).case(true, 1).default(stub), 1)
  t.false(state.called)
})

test('Calls default if matched', (t) => {
  const { stub, state } = getStub(2)
  t.is(switchFunctional(0).case(false, 1).default(stub), 2)
  t.true(state.called)
  t.is(state.lastArgument, 0)
})

test('Does not call case if not matched', (t) => {
  const { stub, state } = getStub(1)
  t.is(switchFunctional(0).case(false, stub).default(2), 2)
  t.false(state.called)
})

test('Does not call case if already matched', (t) => {
  const { stub, state } = getStub(2)
  t.is(switchFunctional(0).case(true, 1).case(true, stub).default(3), 1)
  t.false(state.called)
})

test('Calls case if matched', (t) => {
  const { stub, state } = getStub(2)
  t.is(switchFunctional(0).case(false, 1).case(true, stub).default(3), 2)
  t.true(state.called)
  t.is(state.lastArgument, 0)
})

each(
  [0, 0n, '', true, null, undefined, Symbol(''), {}, []] as const,
  ({ title }, input) => {
    test(`Can return any type except function | ${title}`, (t) => {
      t.is(switchFunctional(0).case(true, input).default(1), input)
    })
  },
)

test('Can return a function from another one', (t) => {
  t.is(
    switchFunctional(0)
      .case(true, () => noop)
      .default(1),
    noop,
  )
})

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
  ] as const,
  ({ title }, [input, condition]) => {
    test(`Can not match equality conditions | ${title}`, (t) => {
      t.is(switchFunctional(input).case(condition, 1).default(2), 2)
    })
  },
)
