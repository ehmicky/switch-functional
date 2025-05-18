import { expectAssignable, expectNotAssignable, expectType } from 'tsd'

import switchFunctional, {
  type Condition,
  type Switch,
} from 'switch-functional'

const switchStatement = switchFunctional(true as const)
expectAssignable<Switch>(switchStatement)

// @ts-expect-error
switchFunctional()
// @ts-expect-error
switchFunctional(true, {})

switchFunctional(0)
switchFunctional(0n)
switchFunctional(true)
switchFunctional(null)
switchFunctional(undefined)
switchFunctional('')
switchFunctional(Symbol(''))
switchFunctional({} as const)
switchFunctional([] as const)
switchFunctional(() => {})

const caseStatement = switchStatement.case(true, 0 as const)

expectType<Switch<0, true>>(switchStatement.case(true, 0))
expectType<Switch<0 | 1, true>>(caseStatement.case(true, 1))

switchStatement.case(0, true)
switchStatement.case(0n, true)
switchStatement.case(true, true)
switchStatement.case(null, true)
switchStatement.case(undefined, true)
switchStatement.case('', true)
switchStatement.case(Symbol(''), true)
switchStatement.case({} as const, true)
switchStatement.case({ a: true } as const, true)
switchStatement.case({ a: () => '' } as const, true)
switchStatement.case([] as const, true)
switchStatement.case([true] as const, true)
switchStatement.case([() => ''] as const, true)
switchStatement.case(() => true, true)
switchStatement.case((value: true) => true, true)
caseStatement.case(0, true)
caseStatement.case(0n, true)
caseStatement.case(true, true)
caseStatement.case(null, true)
caseStatement.case(undefined, true)
caseStatement.case('', true)
caseStatement.case(Symbol(''), true)
caseStatement.case({} as const, true)
caseStatement.case({ a: true } as const, true)
caseStatement.case({ a: () => '' } as const, true)
caseStatement.case([] as const, true)
caseStatement.case([true] as const, true)
caseStatement.case([() => ''] as const, true)
caseStatement.case(() => true, true)
caseStatement.case((value: true) => true, true)
expectAssignable<Condition>(0)
expectAssignable<Condition>(0n)
expectAssignable<Condition>(true)
expectAssignable<Condition>(null)
expectAssignable<Condition>(undefined)
expectAssignable<Condition>('')
expectAssignable<Condition>(Symbol(''))
expectAssignable<Condition>({} as const)
expectAssignable<Condition>({ a: true } as const)
expectAssignable<Condition>({ a: () => '' } as const)
expectAssignable<Condition>([] as const)
expectAssignable<Condition>([true] as const)
expectAssignable<Condition>([() => ''] as const)
expectAssignable<Condition>(() => true)
expectAssignable<Condition<true>>(() => true)
expectAssignable<Condition<true>>((value: true) => true)

// @ts-expect-error
switchStatement.case(() => '', true)
// @ts-expect-error
switchStatement.case((value: false) => true, true)
// @ts-expect-error
switchStatement.case((value: true, second: true) => true, true)
// @ts-expect-error
caseStatement.case(() => '', true)
// @ts-expect-error
caseStatement.case((value: false) => true, true)
// @ts-expect-error
caseStatement.case((value: true, second: true) => true, true)
expectNotAssignable<Condition>(() => '')
expectNotAssignable<Condition<true>>((value: false) => true)
expectNotAssignable<Condition<true>>((value: true, second: true) => true)

switchStatement.case(true, 0)
switchStatement.case(true, 0n)
switchStatement.case(true, true)
switchStatement.case(true, null)
switchStatement.case(true, undefined)
switchStatement.case(true, '')
switchStatement.case(true, Symbol(''))
switchStatement.case(true, {} as const)
switchStatement.case(true, [] as const)
switchStatement.case(true, () => {})
switchStatement.case(true, (value: true) => {})
caseStatement.case(true, 0)
caseStatement.case(true, 0n)
caseStatement.case(true, true)
caseStatement.case(true, null)
caseStatement.case(true, undefined)
caseStatement.case(true, '')
caseStatement.case(true, Symbol(''))
caseStatement.case(true, {} as const)
caseStatement.case(true, [] as const)
caseStatement.case(true, () => {})
caseStatement.case(true, (value: true) => {})

// @ts-expect-error
switchStatement.case()
// @ts-expect-error
switchStatement.case(true)
// @ts-expect-error
switchStatement.case(true, true, true)
// @ts-expect-error
switchStatement.case(true, (value: false) => {})
// @ts-expect-error
switchStatement.case(true, (value: true, second: false) => {})
// @ts-expect-error
caseStatement.case()
// @ts-expect-error
caseStatement.case(true)
// @ts-expect-error
caseStatement.case(true, true, true)
// @ts-expect-error
caseStatement.case(true, (value: false) => {})
// @ts-expect-error
caseStatement.case(true, (value: true, second: false) => {})

switchStatement.default(0)
switchStatement.default(0n)
switchStatement.default(true)
switchStatement.default(null)
switchStatement.default(undefined)
switchStatement.default('')
switchStatement.default(Symbol(''))
switchStatement.default({} as const)
switchStatement.default([] as const)
switchStatement.default(() => {})
switchStatement.default((value: true) => {})
caseStatement.default(0)
caseStatement.default(0n)
caseStatement.default(true)
caseStatement.default(null)
caseStatement.default(undefined)
caseStatement.default('')
caseStatement.default(Symbol(''))
caseStatement.default({} as const)
caseStatement.default([] as const)
caseStatement.default(() => {})
caseStatement.default((value: true) => {})

// @ts-expect-error
switchStatement.default()
// @ts-expect-error
switchStatement.default(true, true)
// @ts-expect-error
switchStatement.default((value: false) => {})
// @ts-expect-error
switchStatement.default((value: true, second: false) => {})
// @ts-expect-error
caseStatement.default()
// @ts-expect-error
caseStatement.default(true, true)
// @ts-expect-error
caseStatement.default((value: false) => {})
// @ts-expect-error
caseStatement.default((value: true, second: false) => {})

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
switchStatement.other()
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
caseStatement.other()

expectType<1>(switchStatement.default(1 as const))
expectType<1 | 2>(switchStatement.case(true, 1 as const).default(2 as const))
expectType<0 | 1>(caseStatement.default(1 as const))
expectType<0 | 1 | 2>(caseStatement.case(true, 1 as const).default(2 as const))

expectType<Switch<1, true>>(switchStatement.case(true, 1 as const))
expectType<Switch<1 | 2, true>>(
  switchStatement.case(true, 1 as const).case(true, 2 as const),
)
expectType<Switch<0 | 1, true>>(caseStatement.case(true, 1 as const))
expectType<Switch<0 | 1 | 2, true>>(
  caseStatement.case(true, 1 as const).case(true, 2 as const),
)

expectAssignable<Switch<1 | 2, true>>(switchStatement.case(true, 1 as const))
expectAssignable<Switch<0 | 1 | 2, true>>(caseStatement.case(true, 1 as const))
