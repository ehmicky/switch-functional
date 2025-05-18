import { expectAssignable, expectNotAssignable, expectType } from 'tsd'

import switchFunctional, {
  type Condition,
  type Switch,
} from 'switch-functional'

const switchStatement = switchFunctional(true)
expectType<Switch>(switchStatement)

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

expectType<Switch>(switchStatement.case(true, true))

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

// @ts-expect-error
switchStatement.case(() => '', true)
expectNotAssignable<Condition>(() => '')

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

// @ts-expect-error
switchStatement.case()
// @ts-expect-error
switchStatement.case(true)
// @ts-expect-error
switchStatement.case(true, true, true)

expectAssignable<unknown>(switchStatement.default(true))

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

// @ts-expect-error
switchStatement.default()
// @ts-expect-error
switchStatement.default(true, true)

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
switchStatement.other()

expectType<1>(switchStatement.default(1 as const))
expectType<1 | 2>(switchStatement.case(true, 2 as const).default(1 as const))
