import { expectAssignable, expectNotAssignable, expectType } from 'tsd'

import switchFunctional, {
  type Condition,
  type Options,
  type Switch,
} from 'switch-functional'

const switchStatement = switchFunctional(true as const)
expectAssignable<Switch>(switchStatement)
expectAssignable<Switch<never, never, never, true>>(switchStatement)

expectAssignable<Switch<never, never, never, true>>(
  switchFunctional(true as const, {} as const),
)
expectAssignable<Options>({} as const)

const customSwitchStatement = switchFunctional(
  true as const,
  {
    mapCondition: (customCondition: string) => (value: true) =>
      customCondition === 'a',
  } as const,
)
expectAssignable<Options<string>>({
  mapCondition: (customCondition: string) => (value: unknown) =>
    customCondition === 'a',
} as const)
expectAssignable<Switch<never, string, never, true>>(customSwitchStatement)

const otherSwitchStatement = switchFunctional(
  true as const,
  {
    mapReturnValues: (one: string, two?: boolean) => (value: true) =>
      one === String(two),
  } as const,
)
expectAssignable<
  Options<never, [string, boolean | undefined], true, (value: true) => boolean>
>({
  mapReturnValues: (one: string, two?: boolean) => (value: true) =>
    one === String(two),
} as const)
expectAssignable<
  Switch<
    never,
    never,
    [string, boolean | undefined],
    true,
    (value: true) => boolean
  >
>(otherSwitchStatement)

expectAssignable<Switch<never, string, never, true>>(
  switchFunctional(
    true as const,
    { mapCondition: (customCondition: string) => true } as const,
  ),
)
expectAssignable<Options<string>>({
  mapCondition: (customCondition: string) => true,
} as const)

expectAssignable<
  Switch<never, never, [string, boolean | undefined], true, true>
>(
  switchFunctional(
    true as const,
    { mapReturnValues: (one: string, two?: boolean) => true } as const,
  ),
)
expectAssignable<Options<never, [string, boolean | undefined], unknown, true>>({
  mapReturnValues: (one: string, two?: boolean) => true,
} as const)

expectAssignable<Switch<never, string, never, true>>(
  switchFunctional(
    true as const,
    { mapCondition: (customCondition: string) => 1 } as const,
  ),
)
expectAssignable<Options<string>>({
  mapCondition: (customCondition: string) => 1,
} as const)

expectAssignable<Switch<never, never, [string, boolean | undefined], true, 1>>(
  switchFunctional(
    true as const,
    { mapReturnValues: (one: string, two?: boolean) => 1 } as const,
  ),
)
expectAssignable<Options<never, [string, boolean | undefined], unknown, 1>>({
  mapReturnValues: (one: string, two?: boolean) => 1,
} as const)

expectAssignable<Switch<never, string, never, true>>(
  switchFunctional(
    true as const,
    { mapCondition: (customCondition: string) => undefined } as const,
  ),
)
expectAssignable<Options<string>>({
  mapCondition: (customCondition: string) => undefined,
} as const)

expectAssignable<
  Switch<never, never, [string, boolean | undefined], true, undefined>
>(
  switchFunctional(
    true as const,
    { mapReturnValues: (one: string, two?: boolean) => undefined } as const,
  ),
)
expectAssignable<
  Options<never, [string, boolean | undefined], unknown, undefined>
>({
  mapReturnValues: (one: string, two?: boolean) => undefined,
} as const)

expectAssignable<Switch<never, unknown, never, true>>(
  switchFunctional(
    true as const,
    { mapCondition: (customCondition: unknown) => true } as const,
  ),
)
expectAssignable<Options>({
  mapCondition: (customCondition: unknown) => true,
} as const)

expectAssignable<Switch<never, never, [unknown], true, true>>(
  switchFunctional(
    true as const,
    { mapReturnValues: (one: unknown) => true } as const,
  ),
)
expectAssignable<Options<never, [unknown], unknown, true>>({
  mapReturnValues: (one: unknown) => true,
} as const)

expectAssignable<Switch<never, string, never, true>>(
  switchFunctional(true as const, {
    mapCondition: (customCondition: string) => () => customCondition === 'a',
  }),
)
expectAssignable<Options<string>>({
  mapCondition: (customCondition: string) => () => customCondition === 'a',
} as const)

expectAssignable<
  Options<never, [string, boolean | undefined], true, () => boolean>
>({
  mapReturnValues: (one: string, two?: boolean) => () => one === String(two),
} as const)
expectAssignable<
  Switch<
    never,
    never,
    [string, boolean | undefined],
    true,
    (value: true) => boolean
  >
>(
  switchFunctional(
    true as const,
    {
      mapReturnValues: (one: string, two?: boolean) => () =>
        one === String(two),
    } as const,
  ),
)

expectAssignable<Options<never, readonly unknown[], true, boolean>>({
  mapReturnValues: (...args: readonly unknown[]) => args.length === 1,
} as const)
expectAssignable<Switch<never, never, readonly unknown[], true, boolean>>(
  switchFunctional(
    true as const,
    {
      mapReturnValues: (...args: readonly unknown[]) => args.length === 1,
    } as const,
  ),
)

// @ts-expect-error
switchFunctional(true as const, { mapCondition: undefined })
expectNotAssignable<Options>({ mapCondition: undefined })

// @ts-expect-error
switchFunctional(true as const, { mapReturnValues: undefined })
expectNotAssignable<Options>({ mapReturnValues: undefined })

// @ts-expect-error
switchFunctional(true as const, { mapCondition: true })
expectNotAssignable<Options>({ mapCondition: true })

// @ts-expect-error
switchFunctional(true as const, { mapReturnValues: true })
expectNotAssignable<Options>({ mapReturnValues: true })

switchFunctional(true as const, {
  // @ts-expect-error
  mapCondition: (customCondition: 'a', value: 'b') => true,
})
expectNotAssignable<Options>({
  mapCondition: (customCondition: 'a', value: 'b') => true,
})

switchFunctional(true as const, {
  // @ts-expect-error
  mapCondition: (customCondition: 'a') => () => customCondition,
})
expectNotAssignable<Options>({
  mapCondition: (customCondition: 'a') => () => customCondition,
})

switchFunctional(
  // @ts-expect-error
  true as const,
  {
    mapCondition: (customCondition: string) => (value: false) =>
      customCondition === 'a',
  },
)
expectNotAssignable<Options>({
  mapCondition: (customCondition: string) => (value: false) =>
    customCondition === 'a',
})

switchFunctional(true as const, {
  // @ts-expect-error
  mapReturnValues: (one: string) => (value: false) => one,
})
expectNotAssignable<Options>({
  mapReturnValues: (one: string) => (value: false) => one,
})

switchFunctional(true as const, {
  // @ts-expect-error
  mapCondition: (customCondition: string) => (value: true, second: true) =>
    customCondition === 'a',
})
expectNotAssignable<Options>({
  mapCondition: (customCondition: string) => (value: true, second: true) =>
    customCondition === 'a',
})

switchFunctional(true as const, {
  // @ts-expect-error
  mapReturnValues: (one: string) => (value: true, second: true) => one,
})
expectNotAssignable<Options>({
  mapReturnValues: (one: string) => (value: false, second: true) => one,
})

// @ts-expect-error
switchFunctional()
// @ts-expect-error
switchFunctional(true, null)

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

const caseStatement = switchStatement.case(true, 0)
expectType<Switch<0, never, never, true>>(caseStatement)

const customCaseStatement = customSwitchStatement.case('a', 0)
expectType<Switch<0, string, never, true>>(customCaseStatement)

const otherCaseStatement = otherSwitchStatement.case(false, 'b' as const)
expectType<
  Switch<
    boolean,
    never,
    [one: string, two?: boolean | undefined],
    true,
    (value: true) => boolean
  >
>(otherCaseStatement)

expectType<Switch<0 | 1, never, never, true>>(caseStatement.case(true, 1))
expectType<Switch<0 | 1, string, never, true>>(customCaseStatement.case('a', 1))
expectType<
  Switch<
    boolean,
    never,
    [one: string, two?: boolean | undefined],
    true,
    (value: true) => boolean
  >
>(otherCaseStatement.case(false, 'c' as const))

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
caseStatement.case([{} as const] as const, true)
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
expectAssignable<Condition>([{} as const] as const)
expectAssignable<Condition>([() => ''] as const)
expectAssignable<Condition>(() => true)
expectAssignable<Condition<true>>(() => true)
expectAssignable<Condition<true>>((value: true) => true)

customSwitchStatement.case('a', true)
customSwitchStatement.case(['a', 'b'], true)
customCaseStatement.case('a', true)
customCaseStatement.case(['a', 'b'], true)

otherSwitchStatement.case(0, 'a')
otherSwitchStatement.case(0n, 'a')
otherSwitchStatement.case(true, 'a')
otherSwitchStatement.case(null, 'a')
otherSwitchStatement.case(undefined, 'a')
otherSwitchStatement.case('', 'a')
otherSwitchStatement.case(Symbol(''), 'a')
otherSwitchStatement.case({} as const, 'a')
otherSwitchStatement.case({ a: true } as const, 'a')
otherSwitchStatement.case({ a: () => '' } as const, 'a')
otherSwitchStatement.case([] as const, 'a')
otherSwitchStatement.case([true] as const, 'a')
otherSwitchStatement.case([() => ''] as const, 'a')
otherSwitchStatement.case(() => true, 'a')
otherSwitchStatement.case((value: true) => true, 'a')
otherCaseStatement.case(0, 'a')
otherCaseStatement.case(0n, 'a')
otherCaseStatement.case(true, 'a')
otherCaseStatement.case(null, 'a')
otherCaseStatement.case(undefined, 'a')
otherCaseStatement.case('', 'a')
otherCaseStatement.case(Symbol(''), 'a')
otherCaseStatement.case({} as const, 'a')
otherCaseStatement.case({ a: true } as const, 'a')
otherCaseStatement.case({ a: () => '' } as const, 'a')
otherCaseStatement.case([] as const, 'a')
otherCaseStatement.case([true] as const, 'a')
otherCaseStatement.case([{} as const] as const, 'a')
otherCaseStatement.case([() => ''] as const, 'a')
otherCaseStatement.case(() => true, 'a')
otherCaseStatement.case((value: true) => true, 'a')

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

// @ts-expect-error
customSwitchStatement(0, true)
// @ts-expect-error
customSwitchStatement(true, true)
// @ts-expect-error
customSwitchStatement(() => '', true)
// @ts-expect-error
customCaseStatement(0, true)
// @ts-expect-error
customCaseStatement(true, true)
// @ts-expect-error
customCaseStatement(() => '', true)

// @ts-expect-error
otherSwitchStatement.case(() => '', 'a')
// @ts-expect-error
otherSwitchStatement.case((value: false) => true, 'a')
// @ts-expect-error
otherSwitchStatement.case((value: true, second: true) => true, 'a')
// @ts-expect-error
otherCaseStatement.case(() => '', 'a')
// @ts-expect-error
otherCaseStatement.case((value: false) => true, 'a')
// @ts-expect-error
otherCaseStatement.case((value: true, second: true) => true, 'a')

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

customSwitchStatement.case('a', 0)
customSwitchStatement.case('a', 0n)
customSwitchStatement.case('a', true)
customSwitchStatement.case('a', null)
customSwitchStatement.case('a', undefined)
customSwitchStatement.case('a', '')
customSwitchStatement.case('a', Symbol(''))
customSwitchStatement.case('a', {} as const)
customSwitchStatement.case('a', [] as const)
customSwitchStatement.case('a', () => {})
customSwitchStatement.case('a', (value: true) => {})
customCaseStatement.case('a', 0)
customCaseStatement.case('a', 0n)
customCaseStatement.case('a', true)
customCaseStatement.case('a', null)
customCaseStatement.case('a', undefined)
customCaseStatement.case('a', '')
customCaseStatement.case('a', Symbol(''))
customCaseStatement.case('a', {} as const)
customCaseStatement.case('a', [] as const)
customCaseStatement.case('a', () => {})
customCaseStatement.case('a', (value: true) => {})

otherSwitchStatement.case(true, 'a')
otherSwitchStatement.case(true, 'a', true)

// @ts-expect-error
otherSwitchStatement.case(true, 0)
// @ts-expect-error
otherSwitchStatement.case(true, () => 'a')
// @ts-expect-error
otherSwitchStatement.case()
// @ts-expect-error
otherSwitchStatement.case(true)
// @ts-expect-error
otherSwitchStatement.case(true, 'a', 0)
// @ts-expect-error
otherSwitchStatement.case(true, 'a', true, 0)
// @ts-expect-error
otherCaseStatement.case(true, 0)
// @ts-expect-error
otherCaseStatement.case(true, () => 'a')
// @ts-expect-error
otherCaseStatement.case()
// @ts-expect-error
otherCaseStatement.case(true)
// @ts-expect-error
otherCaseStatement.case(true, 'a', 0)
// @ts-expect-error
otherCaseStatement.case(true, 'a', true, 0)

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

// @ts-expect-error
customSwitchStatement.case()
// @ts-expect-error
customSwitchStatement.case('a', true, true)
// @ts-expect-error
customSwitchStatement.case('a', (value: false) => {})
// @ts-expect-error
customSwitchStatement.case('a', (value: true, second: false) => {})
// @ts-expect-error
customCaseStatement.case()
// @ts-expect-error
customCaseStatement.case('a', true, true)
// @ts-expect-error
customCaseStatement.case('a', (value: false) => {})
// @ts-expect-error
customCaseStatement.case('a', (value: true, second: false) => {})

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

customSwitchStatement.default(0)
customSwitchStatement.default(0n)
customSwitchStatement.default(true)
customSwitchStatement.default(null)
customSwitchStatement.default(undefined)
customSwitchStatement.default('')
customSwitchStatement.default(Symbol(''))
customSwitchStatement.default({} as const)
customSwitchStatement.default([] as const)
customSwitchStatement.default(() => {})
customSwitchStatement.default((value: true) => {})
customCaseStatement.default(0)
customCaseStatement.default(0n)
customCaseStatement.default(true)
customCaseStatement.default(null)
customCaseStatement.default(undefined)
customCaseStatement.default('')
customCaseStatement.default(Symbol(''))
customCaseStatement.default({} as const)
customCaseStatement.default([] as const)
customCaseStatement.default(() => {})
customCaseStatement.default((value: true) => {})

otherSwitchStatement.default('a')
otherSwitchStatement.default('a', true)

// @ts-expect-error
otherSwitchStatement.default(0)
// @ts-expect-error
otherSwitchStatement.default(() => 'a')
// @ts-expect-error
otherSwitchStatement.default()
// @ts-expect-error
otherSwitchStatement.default('a', 0)
// @ts-expect-error
otherSwitchStatement.default('a', true, 0)
// @ts-expect-error
otherCaseStatement.default(0)
// @ts-expect-error
otherCaseStatement.default(() => 'a')
// @ts-expect-error
otherCaseStatement.default()
// @ts-expect-error
otherCaseStatement.default('a', 0)
// @ts-expect-error
otherCaseStatement.default('a', true, 0)

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
customSwitchStatement.default()
// @ts-expect-error
customSwitchStatement.default(true, true)
// @ts-expect-error
customSwitchStatement.default((value: false) => {})
// @ts-expect-error
customSwitchStatement.default((value: true, second: false) => {})
// @ts-expect-error
customCaseStatement.default()
// @ts-expect-error
customCaseStatement.default(true, true)
// @ts-expect-error
customCaseStatement.default((value: false) => {})
// @ts-expect-error
customCaseStatement.default((value: true, second: false) => {})

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
switchStatement.other()
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
caseStatement.other()

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
customSwitchStatement.other()
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
customCaseStatement.other()

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
otherSwitchStatement.other()
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
otherCaseStatement.other()

expectType<1>(switchStatement.default(1 as const))
expectType<1 | 2>(switchStatement.case(true, 1 as const).default(2 as const))
expectType<0 | 1>(caseStatement.default(1 as const))
expectType<0 | 1 | 2>(caseStatement.case(true, 1 as const).default(2 as const))

expectType<1>(customSwitchStatement.default(1 as const))
expectType<1 | 2>(
  customSwitchStatement.case('a', 1 as const).default(2 as const),
)
expectType<0 | 1>(customCaseStatement.default(1 as const))
expectType<0 | 1 | 2>(
  customCaseStatement.case('a', 1 as const).default(2 as const),
)

expectType<boolean>(otherSwitchStatement.default('a' as const))
expectType<boolean>(
  otherSwitchStatement.case(true, 'a' as const).default('b' as const),
)
expectType<boolean>(otherCaseStatement.default('a' as const))
expectType<boolean>(
  otherCaseStatement.case(true, 'a' as const).default('b' as const),
)

expectType<Switch<1, never, never, true>>(
  switchStatement.case(true, 1 as const),
)
expectType<Switch<1 | 2, never, never, true>>(
  switchStatement.case(true, 1 as const).case(true, 2 as const),
)
expectType<Switch<0 | 1, never, never, true>>(
  caseStatement.case(true, 1 as const),
)
expectType<Switch<0 | 1 | 2, never, never, true>>(
  caseStatement.case(true, 1 as const).case(true, 2 as const),
)

expectType<Switch<1, string, never, true>>(
  customSwitchStatement.case('a', 1 as const),
)
expectType<Switch<1 | 2, string, never, true>>(
  customSwitchStatement.case('a', 1 as const).case('a', 2 as const),
)
expectType<Switch<0 | 1, string, never, true>>(
  customCaseStatement.case('a', 1 as const),
)
expectType<Switch<0 | 1 | 2, string, never, true>>(
  customCaseStatement.case('a', 1 as const).case('a', 2 as const),
)

expectType<
  Switch<
    boolean,
    never,
    [one: string, two?: boolean | undefined],
    true,
    (value: true) => boolean
  >
>(otherSwitchStatement.case(true, 'a' as const))
expectType<
  Switch<
    boolean,
    never,
    [one: string, two?: boolean | undefined],
    true,
    (value: true) => boolean
  >
>(otherSwitchStatement.case(true, 'a' as const).case(true, 'b' as const))
expectType<
  Switch<
    boolean,
    never,
    [one: string, two?: boolean | undefined],
    true,
    (value: true) => boolean
  >
>(otherCaseStatement.case(true, 'a' as const))
expectType<
  Switch<
    boolean,
    never,
    [one: string, two?: boolean | undefined],
    true,
    (value: true) => boolean
  >
>(otherCaseStatement.case(true, 'a' as const).case(true, 'b' as const))

expectType<undefined>(switchStatement.default(undefined))
expectType<undefined>(switchStatement.default(() => undefined))
expectType<0 | undefined>(caseStatement.default(undefined))
expectType<0 | undefined>(caseStatement.default(() => undefined))

expectType<undefined>(customSwitchStatement.default(undefined))
expectType<undefined>(customSwitchStatement.default(() => undefined))
expectType<0 | undefined>(customCaseStatement.default(undefined))
expectType<0 | undefined>(customCaseStatement.default(() => undefined))
