import type {
  AnyCondition,
  AnyConditions,
  AnyReturnValues,
  Condition,
  FinalReturnValue,
  GetFinalValue,
  Input,
  Options,
  Resolved,
  ReturnValue,
  Switch,
} from './types.js'

export type { Condition, Options, Switch }

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
    CustomReturnValues extends readonly unknown[] = never,
    StrictReturnValue extends ReturnValue<OriginalInput> = never,
  >(
    input: OriginalInput,
    options: Options<
      CustomCondition,
      CustomReturnValues,
      OriginalInput,
      StrictReturnValue
    > = {},
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
      CustomReturnValues,
      OriginalInput,
      StrictReturnValue,
      FinalReturnValues
    >({ options, resolved, input, finalValue }),

    /**
     * If one of the `.case()` statements matched, returns its
     * `caseReturnValue`. Else, returns `defaultReturnValue`.
     *
     * `defaultReturnValue` can optionally be a function taking the `input` as
     * argument.
     */
    default: useDefault<
      CustomCondition,
      CustomReturnValues,
      OriginalInput,
      StrictReturnValue,
      FinalReturnValues
    >({ options, resolved, input, finalValue }),
  })

// `switchFunctional(input)[.case(...)].case(conditions, returnValue)`
const addCase =
  // eslint-disable-next-line max-lines-per-function
  <
      CustomCondition,
      CustomReturnValues extends readonly unknown[],
      OriginalInput extends Input,
      StrictReturnValue extends ReturnValue<OriginalInput>,
      FinalReturnValues extends FinalReturnValue,
    >({
      options,
      resolved,
      input,
      finalValue,
    }: {
      options: Options<
        CustomCondition,
        CustomReturnValues,
        OriginalInput,
        StrictReturnValue
      >
      resolved: boolean
      input: OriginalInput
      finalValue?: FinalReturnValues | undefined
    }) =>
    <NewReturnValue extends ReturnValue<OriginalInput> = never>(
      conditions: AnyConditions<CustomCondition, OriginalInput>,
      ...caseReturnValues: AnyReturnValues<
        CustomReturnValues,
        OriginalInput,
        NewReturnValue
      >
    ): Switch<
      FinalReturnValues | GetFinalValue<NewReturnValue, StrictReturnValue>,
      CustomCondition,
      CustomReturnValues,
      OriginalInput,
      StrictReturnValue
    > =>
      resolved || !matchesConditions(input, conditions, options)
        ? (chain(resolved, finalValue)(input, options) as Switch<
            FinalReturnValues,
            CustomCondition,
            CustomReturnValues,
            OriginalInput,
            StrictReturnValue
          >)
        : (chain(true, applyReturnValues(input, caseReturnValues, options))(
            input,
            options,
          ) as Switch<
            GetFinalValue<NewReturnValue, StrictReturnValue>,
            CustomCondition,
            CustomReturnValues,
            OriginalInput,
            StrictReturnValue
          >)

// `switchFunctional(input)[.case()...].default(returnValue)`
const useDefault =
  <
    CustomCondition,
    CustomReturnValues extends readonly unknown[],
    OriginalInput extends Input,
    StrictReturnValue extends ReturnValue<OriginalInput>,
    FinalReturnValues extends FinalReturnValue,
  >({
    options,
    resolved,
    input,
    finalValue,
  }: {
    options: Options<
      CustomCondition,
      CustomReturnValues,
      OriginalInput,
      StrictReturnValue
    >
    resolved: boolean
    input: OriginalInput
    finalValue?: FinalReturnValues | undefined
  }) =>
  <NewReturnValue extends ReturnValue<OriginalInput> = never>(
    ...defaultReturnValues: AnyReturnValues<
      CustomReturnValues,
      OriginalInput,
      NewReturnValue
    >
  ) =>
    resolved
      ? finalValue!
      : (applyReturnValues(
          input,
          defaultReturnValues,
          options,
        ) as GetFinalValue<NewReturnValue, StrictReturnValue>)

const matchesConditions = <
  CustomCondition,
  CustomReturnValues extends readonly unknown[],
  OriginalInput extends Input,
  StrictReturnValue extends ReturnValue<OriginalInput>,
>(
  input: OriginalInput,
  conditions: AnyConditions<CustomCondition, OriginalInput>,
  options: Options<
    CustomCondition,
    CustomReturnValues,
    OriginalInput,
    StrictReturnValue
  >,
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
  CustomReturnValues extends readonly unknown[],
  OriginalInput extends Input,
  StrictReturnValue extends ReturnValue<OriginalInput>,
>(
  input: OriginalInput,
  condition: AnyCondition<CustomCondition, OriginalInput>,
  {
    mapCondition,
  }: Options<
    CustomCondition,
    CustomReturnValues,
    OriginalInput,
    StrictReturnValue
  >,
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

const applyReturnValues = <
  CustomCondition,
  CustomReturnValues extends readonly unknown[],
  OriginalInput extends Input,
  StrictReturnValue extends ReturnValue<OriginalInput>,
>(
  input: OriginalInput,
  returnValues: AnyReturnValues<
    CustomReturnValues,
    OriginalInput,
    ReturnValue<OriginalInput>
  >,
  {
    mapReturnValues,
  }: Options<
    CustomCondition,
    CustomReturnValues,
    OriginalInput,
    StrictReturnValue
  >,
) => {
  const returnValue =
    mapReturnValues === undefined
      ? (returnValues[0] as ReturnValue<OriginalInput>)
      : mapReturnValues(...(returnValues as CustomReturnValues))
  return typeof returnValue === 'function' ? returnValue(input) : returnValue
}

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
