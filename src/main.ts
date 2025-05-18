// Functional `switch` statement
const chain =
  <
    OriginalInput extends Input = never,
    FinalReturnValues extends FinalReturnValue = never,
  >(
    resolved: Resolved,
  ) =>
  <NewInput extends Input>(input: NewInput) => ({
    /**
     * If the `input` matches the `conditions`, the final return value will be
     * `caseReturnValue`.
     *
     * `caseReturnValue` can optionally be a function taking the `input` as argument.
     */
    case: addCase<GetOriginalInput<OriginalInput, NewInput>, FinalReturnValues>(
      { resolved, input },
    ),

    /**
     * If one of the `.case()` statements matched, returns its
     * `caseReturnValue`. Else, returns `defaultReturnValue`.
     *
     * `defaultReturnValue` can optionally be a function taking the `input` as
     * argument.
     */
    default: useDefault<
      GetOriginalInput<OriginalInput, NewInput>,
      FinalReturnValues
    >({ resolved, input }),
  })

type GetOriginalInput<
  OriginalInput extends Input,
  NewInput extends Input,
> = OriginalInput[] extends never[] ? NewInput : OriginalInput

/**
 * Return value of `switchFunctional()` and `switchFunctional().case()`
 */
export interface Switch<
  FinalReturnValues extends FinalReturnValue = never,
  OriginalInput extends Input = Input,
> {
  case: <NewReturnValue extends ReturnValue<OriginalInput>>(
    conditions: Conditions<OriginalInput>,
    caseReturnValue: NewReturnValue,
  ) => Switch<FinalReturnValues | GetReturnValue<NewReturnValue>, OriginalInput>
  default: <NewReturnValue extends ReturnValue<OriginalInput>>(
    defaultReturnValue: NewReturnValue,
  ) => FinalReturnValues | GetReturnValue<NewReturnValue>
}

// `switchFunctional(input)[.case(...)].case(conditions, returnValue)`
const addCase =
  <OriginalInput extends Input, FinalReturnValues extends FinalReturnValue>({
    resolved,
    input,
  }: Context) =>
  <NewReturnValue extends ReturnValue<OriginalInput>>(
    conditions: Conditions<OriginalInput>,
    caseReturnValue: NewReturnValue,
  ): Switch<
    FinalReturnValues | GetReturnValue<NewReturnValue>,
    OriginalInput
  > =>
    resolved || !matchesConditions(input as OriginalInput, conditions)
      ? (chain(resolved)(input as OriginalInput) as Switch<
          FinalReturnValues,
          OriginalInput
        >)
      : (chain(true)(
          applyReturnValue(input as OriginalInput, caseReturnValue),
        ) as Switch<
          FinalReturnValues | GetReturnValue<NewReturnValue>,
          OriginalInput
        >)

// `switchFunctional(input)[.case()...].default(returnValue)`
const useDefault =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  <OriginalInput extends Input, FinalReturnValues extends FinalReturnValue>({
      resolved,
      input,
    }: Context) =>
    <NewReturnValue extends ReturnValue<OriginalInput>>(
      defaultReturnValue: NewReturnValue,
    ) =>
      resolved
        ? (input as FinalReturnValues)
        : (applyReturnValue(
            input as OriginalInput,
            defaultReturnValue,
          ) as GetReturnValue<NewReturnValue>)

const matchesConditions = <OriginalInput extends Input>(
  input: OriginalInput,
  conditions: Conditions<OriginalInput>,
) =>
  Array.isArray(conditions)
    ? (conditions as Condition[]).some((condition) =>
        matchesCondition(input, condition),
      )
    : matchesCondition(input, conditions)

const matchesCondition = <OriginalInput extends Input>(
  input: OriginalInput,
  condition: Condition<OriginalInput>,
) => {
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

const applyReturnValue = <OriginalInput extends Input>(
  input: OriginalInput,
  returnValue: ReturnValue<OriginalInput>,
) => (typeof returnValue === 'function' ? returnValue(input) : returnValue)

/**
 * Functional switch statement. This must be chained with
 * `.case()` statements and end with `.default()`.
 *
 * @example <caption>Basic usage</caption>
 * ```js
 * import switchFunctional from 'switch-functional'
 *
 * const getUserType = (user) =>
 *   switchFunctional(user.type)
 *     .case('dev', 'developer')
 *     .case(['admin', 'owner'], 'administrator')
 *     .default('unknown')
 * ```
 *
 * This is equivalent to:
 *
 * ```js
 * const getUserType = (user) => {
 *   switch (user.type) {
 *     case 'dev': {
 *       return 'developer'
 *     }
 *
 *     case 'admin':
 *
 *     case 'owner': {
 *      return 'administrator'
 *     }
 *
 *     default: {
 *       return 'unknown'
 *     }
 *   }
 * }
 * ```
 *
 * @example <caption>Testing input</caption>
 * ```js
 * const getUserType = (user) =>
 *   switchFunctional(user)
 *     .case(isDeveloper, 'developer')
 *     .case([isAdmin, isOwner], 'admin')
 *     .default('unknown')
 * ```
 *
 * This is equivalent to:
 *
 * ```js
 * const getUserType = (user) => {
 *   if (isDeveloper(user)) {
 *     return 'developer'
 *   }
 *
 *   if (isAdmin(user) || isOwner(user)) {
 *     return 'admin'
 *   }
 *
 *   return 'unknown'
 * }
 * ```
 *
 * @example <caption>Testing properties</caption>
 * ```js
 * const getUserType = (user) =>
 *   switchFunctional(user)
 *     // Checks `user.hasDevProjects === true`
 *     .case({ hasDevProjects: true }, 'developer')
 *     // Checks for deep properties
 *     .case({ devProjectsCount: 0, permissions: { admin: true } }, 'admin')
 *     .default('unknown')
 * ```
 *
 * @example <caption>Returning dynamic values</caption>
 * ```js
 * const getUserType = (user) =>
 *   switchFunctional(user)
 *     .case(isDeveloper, (user) => user.developerType)
 *     .case(isAdmin, (user) => user.adminType)
 *     .default((user) => user.genericType)
 * ```
 */
const switchFunctional = chain(false)

export default switchFunctional

type Resolved = boolean

type Input = unknown

interface Context {
  readonly resolved: Resolved
  readonly input: Input
}

type Conditions<PassedInput extends Input = Input> =
  | Condition<PassedInput>
  | readonly Condition<PassedInput>[]

/**
 * The `conditions` can be:
 *
 * - Any value, checked for equality with
 *   [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
 * - An object containing of subset of properties
 * - A filtering function taking the `input` as argument and returning a boolean
 * - A boolean
 * - An array of the above types, checking if _any_ condition in the array matches
 */
export type Condition<OriginalInput extends Input = Input> =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | readonly unknown[]
  | { readonly [key: PropertyKey]: unknown }
  | ConditionFunction<OriginalInput>

type ConditionFunction<OriginalInput extends Input> = (
  input: OriginalInput,
) => boolean

type ReturnValue<OriginalInput extends Input> =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | readonly unknown[]
  | { readonly [key: PropertyKey]: unknown }
  | ReturnValueFunction<OriginalInput>

type FinalReturnValue = unknown

type ReturnValueFunction<OriginalInput extends Input> = (
  input: OriginalInput,
) => unknown

type GetReturnValue<NewReturnValue> = NewReturnValue extends (
  ...args: never[]
) => unknown
  ? ReturnType<NewReturnValue>
  : NewReturnValue
