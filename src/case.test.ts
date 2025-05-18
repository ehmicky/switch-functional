import test from 'ava'

import switchFunctional from 'switch-functional'

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
