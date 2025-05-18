/* eslint-disable max-lines */
// Functional `switch` statement
const chain =
  <FinalReturnValues extends FinalReturnValue = never>(
    resolved: Resolved,
    finalValue?: FinalReturnValues,
  ) =>
  <
    OriginalInput extends Input,
    CustomCondition = never,
    CustomReturnValue = never,
  >(
    input: OriginalInput,
    options: Options<CustomCondition, CustomReturnValue, OriginalInput> = {},
  ) => ({
    /**
     * If the `input` matches the `conditions`, the final return value will be
     * `caseReturnValue`.
     *
     * `caseReturnValue` can optionally be a function taking the `input` as
     * argument.
     */
    case: addCase<
      CustomCondition,
      CustomReturnValue,
      OriginalInput,
      FinalReturnValues
    >(options, resolved, input, finalValue),

    /**
     * If one of the `.case()` statements matched, returns its
     * `caseReturnValue`. Else, returns `defaultReturnValue`.
     *
     * `defaultReturnValue` can optionally be a function taking the `input` as
     * argument.
     */
    default: useDefault<
      CustomCondition,
      CustomReturnValue,
      OriginalInput,
      FinalReturnValues
    >(options, resolved, input, finalValue),
  })

/**
 * Return value of `switchFunctional()` and `switchFunctional().case()`
 */
export interface Switch<
  FinalReturnValues extends FinalReturnValue = never,
  CustomCondition = never,
  CustomReturnValue = never,
  OriginalInput extends Input = Input,
> {
  case: <NewReturnValue extends ReturnValue<OriginalInput>>(
    conditions: AnyConditions<CustomCondition, OriginalInput>,
    caseReturnValue: NewReturnValue,
  ) => Switch<
    FinalReturnValues | ValueOrReturn<NewReturnValue>,
    CustomCondition,
    CustomReturnValue,
    OriginalInput
  >
  default: <NewReturnValue extends ReturnValue<OriginalInput>>(
    defaultReturnValue: NewReturnValue,
  ) => FinalReturnValues | ValueOrReturn<NewReturnValue>
}

// `switchFunctional(input)[.case(...)].case(conditions, returnValue)`
const addCase =
  <
    CustomCondition,
    CustomReturnValue,
    OriginalInput extends Input,
    FinalReturnValues extends FinalReturnValue,
  >(
    options: Options<CustomCondition, CustomReturnValue, OriginalInput>,
    resolved: boolean,
    input: OriginalInput,
    finalValue?: FinalReturnValues,
  ) =>
  <NewReturnValue extends ReturnValue<OriginalInput>>(
    conditions: AnyConditions<CustomCondition, OriginalInput>,
    caseReturnValue: NewReturnValue,
  ): Switch<
    FinalReturnValues | ValueOrReturn<NewReturnValue>,
    CustomCondition,
    CustomReturnValue,
    OriginalInput
  > =>
    resolved || !matchesConditions(input, conditions, options)
      ? (chain(resolved, finalValue)(input, options) as Switch<
          FinalReturnValues,
          CustomCondition,
          CustomReturnValue,
          OriginalInput
        >)
      : (chain(true, applyReturnValue(input, caseReturnValue))(
          input,
          options,
        ) as Switch<
          ValueOrReturn<NewReturnValue>,
          CustomCondition,
          CustomReturnValue,
          OriginalInput
        >)

// `switchFunctional(input)[.case()...].default(returnValue)`
const useDefault =
  <
    CustomCondition,
    CustomReturnValue,
    OriginalInput extends Input,
    FinalReturnValues extends FinalReturnValue,
  >(
    options: Options<CustomCondition, CustomReturnValue, OriginalInput>,
    resolved: boolean,
    input: OriginalInput,
    finalValue?: FinalReturnValues,
  ) =>
  <NewReturnValue extends ReturnValue<OriginalInput>>(
    defaultReturnValue: NewReturnValue,
  ) =>
    resolved
      ? finalValue!
      : (applyReturnValue(
          input,
          defaultReturnValue,
        ) as ValueOrReturn<NewReturnValue>)

const matchesConditions = <
  CustomCondition,
  CustomReturnValue,
  OriginalInput extends Input,
>(
  input: OriginalInput,
  conditions: AnyConditions<CustomCondition, OriginalInput>,
  options: Options<CustomCondition, CustomReturnValue, OriginalInput>,
) =>
  Array.isArray(conditions)
    ? conditions.some((condition) =>
        matchesCondition(
          input,
          condition as AnyCondition<CustomCondition, OriginalInput>,
          options,
        ),
      )
    : matchesCondition(
        input,
        conditions as AnyCondition<CustomCondition, OriginalInput>,
        options,
      )

const matchesCondition = <
  CustomCondition,
  CustomReturnValue,
  OriginalInput extends Input,
>(
  input: OriginalInput,
  condition: AnyCondition<CustomCondition, OriginalInput>,
  { mapCondition }: Options<CustomCondition, CustomReturnValue, OriginalInput>,
) => {
  const normalizedCondition =
    mapCondition === undefined
      ? (condition as Condition<OriginalInput>)
      : mapCondition(condition as CustomCondition)

  if (typeof normalizedCondition === 'function') {
    return normalizedCondition(input)
  }

  if (typeof normalizedCondition === 'boolean') {
    return normalizedCondition
  }

  return deepIncludes(input, normalizedCondition)
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

type AnyConditions<
  CustomCondition,
  OriginalInput extends Input,
> = CustomCondition[] extends never[]
  ? Conditions<OriginalInput>
  : CustomConditions<CustomCondition>

type AnyCondition<
  CustomCondition,
  OriginalInput extends Input,
> = CustomCondition[] extends never[]
  ? Condition<OriginalInput>
  : CustomCondition

type CustomConditions<CustomCondition> =
  | CustomCondition
  | readonly CustomCondition[]

type Conditions<OriginalInput extends Input> =
  | Condition<OriginalInput>
  | readonly Condition<OriginalInput>[]

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

type ValueOrReturn<NewReturnValue> = NewReturnValue extends (
  ...args: never[]
) => unknown
  ? ReturnType<NewReturnValue>
  : NewReturnValue

/**
 *
 */
export interface Options<
  CustomCondition = unknown,
  CustomReturnValue = unknown,
  OriginalInput extends Input = Input,
> {
  /**
   *
   */
  readonly mapCondition?: (
    customCondition: CustomCondition,
  ) => Condition<OriginalInput>

  /**
   *
   */
  readonly mapReturnValues?: (
    customReturnValues: CustomReturnValue[],
  ) => ReturnValue<OriginalInput>
}
