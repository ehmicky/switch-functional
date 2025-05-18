import { applyReturnValues } from './return.js'
import type {
  AnyReturnValues,
  FinalReturnValue,
  GetFinalValue,
  Input,
  Options,
  ReturnValue,
} from './types.js'

/**
 * Return value of `switchFunctional().default()`
 */
export const addDefault =
  <
    CustomCondition,
    CustomReturnValues extends readonly unknown[],
    OriginalInput extends Input,
    StrictReturnValue extends ReturnValue<OriginalInput>,
    FinalReturnValues extends FinalReturnValue,
  >({
    resolved,
    options,
    input,
    finalValue,
  }: {
    resolved: boolean
    options: Options<
      CustomCondition,
      CustomReturnValues,
      OriginalInput,
      StrictReturnValue
    >
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
