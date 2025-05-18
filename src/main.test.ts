import test from 'ava'
import { each } from 'test-each'

import switchFunctional from 'switch-functional'

const noop = () => {}

const getStub = <T>(value: T) => {
  const state = { called: false }
  return {
    state,
    stub: () => {
      state.called = true
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
