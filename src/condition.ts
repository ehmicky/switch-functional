import type {
  AnyCondition,
  AnyConditions,
  Condition,
  Input,
  Options,
  ReturnValue,
} from './types.js'

/**
 * Check whether a specific `.case()` matches
 */
export const matchesConditions = <
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
