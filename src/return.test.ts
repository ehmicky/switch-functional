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
