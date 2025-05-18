/**
 * Keeps track of whether a `.case()` has previously matched.
 */
export type Resolved = boolean

/**
 * Argument passed to `switchFunctional(input)`
 */
export type Input = unknown

/**
 * Argument passed to `.case(conditions)`
 * Can be an array or not. Can use `options.mapCondition()` or not.
 */
export type AnyConditions<
  CustomCondition,
  OriginalInput extends Input,
> = CustomCondition[] extends never[]
  ? Conditions<OriginalInput>
  : CustomConditions<CustomCondition>

/**
 * Argument passed to `.case(conditions)`
 * Must not be an array. Can use `options.mapCondition()` or not.
 */
export type AnyCondition<
  CustomCondition,
  OriginalInput extends Input,
> = CustomCondition[] extends never[]
  ? Condition<OriginalInput>
  : CustomCondition

/**
 * Argument passed to `.case(conditions)`
 * Can be an array or not. Must use `options.mapCondition()`.
 */
type CustomConditions<CustomCondition> =
  | CustomCondition
  | readonly CustomCondition[]

/**
 * Argument passed to `.case(conditions)`
 * Can be an array or not. Must not use `options.mapCondition()`.
 */
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

/**
 * Function passed to `.case((input) => condition)`
 */
type ConditionFunction<OriginalInput extends Input> = (
  input: OriginalInput,
) => boolean

/**
 * Arguments passed to `.case(..., ...returnValues)`
 * Can be variadic. Can use `options.mapReturnValues()` or not.
 */
export type AnyReturnValues<
  CustomReturnValues extends readonly unknown[],
  OriginalInput extends Input,
  NewReturnValue extends ReturnValue<OriginalInput>,
> = CustomReturnValues[] extends never[]
  ? readonly [NewReturnValue]
  : CustomReturnValues

/**
 * Arguments passed to `.case(..., ...returnValues)`
 * After applying `options.mapReturnValues()` if any.
 */
export type ReturnValue<OriginalInput extends Input> =
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

/**
 * Arguments passed to `.case(..., ...returnValues)`
 * After applying `options.mapReturnValues()` if any.
 * After calling the function if any was used: `.case(..., () => returnValue)`
 */
export type FinalReturnValue = unknown

/**
 * Function passed to  `.case(..., (...) => returnValue)`
 */
type ReturnValueFunction<OriginalInput extends Input> = (
  input: OriginalInput,
) => unknown

/**
 * Get the return values, as passed to `.case(..., ...returnValues)`
 * After applying `options.mapReturnValues()` if any.
 * After calling the function if any was used: `.case(..., () => returnValue)`
 */
export type GetFinalValue<NewReturnValue, StrictReturnValue> = ReturnOrValue<
  NewReturnValue[] extends never[] ? StrictReturnValue : NewReturnValue
>

/**
 * Get the return type of the function passed to
 * `.case(..., (...) => returnValue)`, if one was used
 */
type ReturnOrValue<NewReturnValue> = NewReturnValue extends (
  ...args: readonly never[]
) => unknown
  ? ReturnType<NewReturnValue>
  : NewReturnValue

/**
 * Options passed to `switchFunctional(input, options)`
 */
export interface Options<
  CustomCondition = unknown,
  CustomReturnValues extends readonly unknown[] = unknown[],
  OriginalInput extends Input = Input,
  StrictReturnValue extends
    ReturnValue<OriginalInput> = ReturnValue<OriginalInput>,
> {
  /**
   * Function mapping each value passed to `.case(value)` or `.case(value[])`.
   *
   * Can return any value condition, including a function taking the `input` as
   * argument. Cannot return an array of conditions.
   *
   * This allows augmenting the syntax of `.case()` to support domain-specific
   * custom conditions.
   *
   * @example
   * ```js
   * import { Admin, Developer } from './user-classes.js'
   *
   * // Augment the `.case()` syntax to support domain-specific conditions.
   * // In this example, this allows conditions to be user classes.
   * const mapCondition = (condition) =>
   *   USER_CLASSES.has(condition) ? (user) => user instanceof condition : condition
   *
   * const USER_CLASSES = new Set([Admin, Developer])
   *
   * export const customSwitch = (user) => switchFunctional(user, { mapCondition })
   * ```
   *
   * ```js
   * import { customSwitch } from './custom-switch.js'
   * import { Admin, Developer } from './user-classes.js'
   *
   * const getUserType = (user) =>
   *   customSwitch(user)
   *     .case(Developer, 'developer')
   *     .case(Admin, 'admin')
   *     .default('unknown')
   * ```
   */
  // Known limitations of the types:
  //  - The mapping function must have at least one parameter, even if unused
  readonly mapCondition?: (
    customCondition: CustomCondition,
  ) => Condition<OriginalInput>

  /**
   * Function mapping each return value passed to `.case(..., caseReturnValue)`
   * or `.default(defaultReturnValue)`.
   *
   * Can return any value, including a function taking the `input` as argument.
   *
   * Can have multiple parameters: this allows calling `.case()` and `.default()`
   * with multiple arguments.
   *
   * This allows augmenting the syntax of `.case()` and `.default()` to support
   * domain-specific custom transforms.
   *
   * @example
   * ```js
   * // Augment the `.case()` and `.default()` syntax to support domain-specific
   * // logic applied on the return values.
   * // In this example, the return value is kept as is. However, it is logged.
   * const mapReturnValues = (returnValue) => {
   *   console.log(returnValue)
   *   return returnValue
   * }
   *
   * export const customSwitch = (user) =>
   *   switchFunctional(user, { mapReturnValues })
   * ```
   *
   * ```js
   * import { customSwitch } from './custom-switch.js'
   *
   * // 'developer', 'admin' or 'unknown' will be logged
   * const getUserType = (user) =>
   *   customSwitch(user)
   *     .case(isDeveloper, 'developer')
   *     .case(isAdmin, 'admin')
   *     .default('unknown')
   * ```
   */
  // Known limitations of the types:
  //  - The mapping function must have at least one parameter, even if unused
  //  - The value returned by `.default()` will have the same type as
  //    `StrictReturnValue`. Without `mapReturnValues()`, it can have a stricter
  //    type, e.g. the an union of the raw values passed to each `.case()` or
  //    `.default()`
  readonly mapReturnValues?: (
    ...customReturnValues: CustomReturnValues
  ) => StrictReturnValue
}

/**
 * Return value of `switchFunctional()` and `switchFunctional().case()`
 */
export interface Switch<
  FinalReturnValues extends FinalReturnValue = never,
  CustomCondition = never,
  CustomReturnValues extends readonly unknown[] = never,
  OriginalInput extends Input = Input,
  StrictReturnValue extends
    ReturnValue<OriginalInput> = ReturnValue<OriginalInput>,
> {
  case: <NewReturnValue extends ReturnValue<OriginalInput> = never>(
    conditions: AnyConditions<CustomCondition, OriginalInput>,
    ...caseReturnValues: AnyReturnValues<
      CustomReturnValues,
      OriginalInput,
      NewReturnValue
    >
  ) => Switch<
    FinalReturnValues | GetFinalValue<NewReturnValue, StrictReturnValue>,
    CustomCondition,
    CustomReturnValues,
    OriginalInput,
    StrictReturnValue
  >
  default: <NewReturnValue extends ReturnValue<OriginalInput> = never>(
    ...defaultReturnValues: AnyReturnValues<
      CustomReturnValues,
      OriginalInput,
      NewReturnValue
    >
  ) => FinalReturnValues | GetFinalValue<NewReturnValue, StrictReturnValue>
}
