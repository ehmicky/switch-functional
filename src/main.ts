// Functional `switch` statement
const chain =
  <ReturnValues extends ReturnValue>(resolved: Resolved) =>
  (input: Input) => ({
    /**
     *
     */
    case: addCase<ReturnValues>({ resolved, input }),

    /**
     *
     */
    default: useDefault<ReturnValues>({ resolved, input }),
  })

/**
 * Return value of `switchFunctional()` and `switchFunctional().case()`
 */
export interface Switch<ReturnValues extends ReturnValue = never> {
  case: <NewReturnValue extends ReturnValue>(
    conditions: Conditions,
    caseReturnValue: NewReturnValue,
  ) => Switch<ReturnValues | GetReturnValue<NewReturnValue>>
  default: <NewReturnValue extends ReturnValue>(
    defaultReturnValue: NewReturnValue,
  ) => ReturnValues | GetReturnValue<NewReturnValue>
}

// `switchFunctional(input)[.case(...)].case(conditions, returnValue)`
const addCase =
  <ReturnValues extends ReturnValue>({ resolved, input }: Context) =>
  <NewReturnValue extends ReturnValue>(
    conditions: Conditions,
    caseReturnValue: NewReturnValue,
  ): Switch<ReturnValues | GetReturnValue<NewReturnValue>> =>
    resolved || !matchesConditions(input, conditions)
      ? chain<ReturnValues>(resolved)(input)
      : chain<ReturnValues | GetReturnValue<NewReturnValue>>(true)(
          applyReturnValue(input, caseReturnValue),
        )

// `switchFunctional(input)[.case()...].default(returnValue)`
const useDefault =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  <ReturnValues extends ReturnValue>({ resolved, input }: Context) =>
    <NewReturnValue extends ReturnValue>(defaultReturnValue: NewReturnValue) =>
      resolved
        ? (input as ReturnValues)
        : (applyReturnValue(
            input,
            defaultReturnValue as unknown,
          ) as GetReturnValue<NewReturnValue>)

const matchesConditions = (input: Input, conditions: Conditions) =>
  Array.isArray(conditions)
    ? (conditions as Condition[]).some((condition) =>
        matchesCondition(input, condition),
      )
    : matchesCondition(input, conditions)

const matchesCondition = (input: Input, condition: Condition) => {
  if (typeof condition === 'function') {
    return condition(input)
  }

  if (typeof condition === 'boolean') {
    return condition
  }

  return deepIncludes(input, condition)
}

// Check for deep equality. For objects (not arrays), check if deep superset.
const deepIncludes = (input: Input, subset: unknown): boolean => {
  if (
    !isObject(input) ||
    !isObject(subset) ||
    Array.isArray(input) !== Array.isArray(subset)
  ) {
    return Object.is(input, subset)
  }

  if (Array.isArray(input) && Array.isArray(subset)) {
    return (
      subset.length === input.length &&
      subset.every((item, index) => deepIncludes(input[index], item))
    )
  }

  return Object.entries(subset).every(([name, child]) =>
    deepIncludes(input[name], child),
  )
}

const isObject = (input: Input): input is { [name: PropertyKey]: unknown } =>
  typeof input === 'object' && input !== null

const applyReturnValue = (input: Input, ReturnValue: ReturnValue): unknown =>
  typeof ReturnValue === 'function'
    ? (ReturnValue as ReturnValueFunction)(input)
    : ReturnValue

/**
 *
 * @example
 * ```js
 * ```
 */
const switchFunctional = chain<never>(false)

export default switchFunctional

type Resolved = boolean

type Input = unknown

interface Context {
  readonly resolved: Resolved
  readonly input: Input
}

type Conditions = Condition | readonly Condition[]

export type Condition =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | readonly unknown[]
  | { readonly [key: PropertyKey]: unknown }
  | ((input: unknown) => boolean)

type ReturnValue = unknown

type GetReturnValue<NewReturnValue extends ReturnValue> =
  NewReturnValue extends ReturnValueFunction
    ? ReturnType<NewReturnValue>
    : NewReturnValue

type ReturnValueFunction = (input: unknown) => unknown
