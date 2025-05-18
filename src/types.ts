export type Resolved = boolean

export type Input = unknown

export type AnyConditions<
  CustomCondition,
  OriginalInput extends Input,
> = CustomCondition[] extends never[]
  ? Conditions<OriginalInput>
  : CustomConditions<CustomCondition>

export type AnyCondition<
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

export type AnyReturnValues<
  CustomReturnValues extends readonly unknown[],
  OriginalInput extends Input,
  NewReturnValue extends ReturnValue<OriginalInput>,
> = CustomReturnValues[] extends never[]
  ? readonly [NewReturnValue]
  : CustomReturnValues

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

export type FinalReturnValue = unknown

type ReturnValueFunction<OriginalInput extends Input> = (
  input: OriginalInput,
) => unknown

export type GetFinalValue<NewReturnValue, StrictReturnValue> = ReturnOrValue<
  NewReturnValue[] extends never[] ? StrictReturnValue : NewReturnValue
>

type ReturnOrValue<NewReturnValue> = NewReturnValue extends (
  ...args: readonly never[]
) => unknown
  ? ReturnType<NewReturnValue>
  : NewReturnValue

/**
 *
 */
export interface Options<
  CustomCondition = unknown,
  CustomReturnValues extends readonly unknown[] = unknown[],
  OriginalInput extends Input = Input,
  StrictReturnValue extends
    ReturnValue<OriginalInput> = ReturnValue<OriginalInput>,
> {
  /**
   *
   */
  // Known limitations of the types:
  //  - The mapping function must have at least one parameter, even if unused
  readonly mapCondition?: (
    customCondition: CustomCondition,
  ) => Condition<OriginalInput>

  /**
   *
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
