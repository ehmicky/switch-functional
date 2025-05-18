import { matchesConditions } from './condition.js'
import { addDefault } from './default.js'
import { applyReturnValues } from './return.js'
import type {
  AnyConditions,
  AnyReturnValues,
  FinalReturnValue,
  GetFinalValue,
  Input,
  Options,
  Resolved,
  ReturnValue,
  Switch,
} from './types.js'

/**
 * Return value of `switchFunctional()` and `switchFunctional.case()`
 */
export const chain =
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
    default: addDefault<
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
