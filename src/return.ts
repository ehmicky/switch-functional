import type { AnyReturnValues, Input, Options, ReturnValue } from './types.js'

export const applyReturnValues = <
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
