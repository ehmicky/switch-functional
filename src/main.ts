// Functional `switch` statement
const chain =
  <AddedEffects extends Effect>(resolved: Resolved) =>
  (value: Value) => ({
    case: addCase<AddedEffects>({ resolved, value }),
    default: useDefault<AddedEffects>({ resolved, value }),
  })

export interface Switch<AddedEffects extends Effect = never> {
  case: <NewEffect extends Effect>(
    conditions: Conditions,
    effect: NewEffect,
  ) => Switch<AddedEffects | GetNewEffect<NewEffect>>
  default: <NewEffect extends Effect>(
    effect: NewEffect,
  ) => AddedEffects | GetNewEffect<NewEffect>
}

type GetNewEffect<NewEffect extends Effect> = NewEffect extends EffectFunction
  ? ReturnType<NewEffect>
  : NewEffect

type EffectFunction = (value: unknown) => unknown

// `switchFunctional(value)[.case(...)].case(conditions, effect)`
const addCase =
  <AddedEffects extends Effect>({ resolved, value }: Context) =>
  <NewEffect extends Effect>(
    conditions: Conditions,
    effect: NewEffect,
  ): Switch<AddedEffects | GetNewEffect<NewEffect>> =>
    resolved || !matchesConditions(value, conditions)
      ? chain<AddedEffects>(resolved)(value)
      : chain<AddedEffects | GetNewEffect<NewEffect>>(true)(
          applyEffect(value, effect),
        )

// `switchFunctional(value)[.case()...].default(effect)`
const useDefault =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  <AddedEffects extends Effect>({ resolved, value }: Context) =>
    <NewEffect extends Effect>(effect: NewEffect) =>
      resolved
        ? (value as AddedEffects)
        : (applyEffect(value, effect as unknown) as GetNewEffect<NewEffect>)

const matchesConditions = (value: Value, conditions: Conditions) =>
  Array.isArray(conditions)
    ? (conditions as Condition[]).some((condition) =>
        matchesCondition(value, condition),
      )
    : matchesCondition(value, conditions)

const matchesCondition = (value: Value, condition: Condition) => {
  if (typeof condition === 'function') {
    return condition(value)
  }

  if (typeof condition === 'boolean') {
    return condition
  }

  return deepIncludes(value, condition)
}

// Check for deep equality. For objects (not arrays), check if deep superset.
const deepIncludes = (value: Value, subset: unknown): boolean => {
  if (
    !isObject(value) ||
    !isObject(subset) ||
    Array.isArray(value) !== Array.isArray(subset)
  ) {
    return Object.is(value, subset)
  }

  if (Array.isArray(value) && Array.isArray(subset)) {
    return (
      subset.length === value.length &&
      subset.every((item, index) => deepIncludes(value[index], item))
    )
  }

  return Object.entries(subset).every(([name, child]) =>
    deepIncludes(value[name], child),
  )
}

const isObject = (value: Value): value is { [name: PropertyKey]: unknown } =>
  typeof value === 'object' && value !== null

const applyEffect = (value: Value, effect: Effect): unknown =>
  typeof effect === 'function' ? (effect as FunctionEffect)(value) : effect

/**
 *
 * @example
 * ```js
 * ```
 */
const switchFunctional = chain<never>(false)

export default switchFunctional

type Resolved = boolean

type Value = unknown

interface Context {
  readonly resolved: Resolved
  readonly value: Value
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
  | ((value: unknown) => boolean)

type Effect = unknown

type FunctionEffect = (value: unknown) => unknown
