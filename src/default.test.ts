import test from 'ava'

import switchFunctional from 'switch-functional'

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
