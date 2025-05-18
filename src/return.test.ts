import test from 'ava'
import { each } from 'test-each'

import switchFunctional from 'switch-functional'

const noop = () => {}

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

test('options.mapReturnValues() can return any type', (t) => {
  t.is(
    switchFunctional(0, {
      mapReturnValues: (condition: number) => -condition,
    })
      .case(true, 1)
      .default(2),
    -1,
  )
})

test('options.mapReturnValues() can return a function', (t) => {
  t.is(
    switchFunctional(1, {
      mapReturnValues: (condition: number) => (value: number) =>
        condition + value,
    })
      .case(true, 2)
      .default(0),
    3,
  )
})

test('options.mapReturnValues() can take variadic parameters', (t) => {
  t.is(
    switchFunctional(0, {
      mapReturnValues: (one: number, two: number) => one + two,
    })
      .case(true, 1, 2)
      .default(0, 0),
    3,
  )
})
