// Functional `switch` statement
const chain = (resolved: Resolved, value: Value): Switch => ({
  case: addCase.bind(undefined, { resolved, value }),
  default: useDefault.bind(undefined, { resolved, value }),
})

export interface Switch {
  case: (conditions: Conditions, effect: Effect) => Switch
  default: (effect: Effect) => unknown
}

// `switchFunctional(value)[.case(...)].case(conditions, effect)`
const addCase = (
  { resolved, value }: Context,
  conditions: Conditions,
  effect: Effect,
) =>
  resolved || !matchesConditions(value, conditions)
    ? chain(resolved, value)
    : chain(true, applyEffect(value, effect))

// `switchFunctional(value)[.case()...].default(effect)`
const useDefault = ({ resolved, value }: Context, effect: Effect) =>
  resolved ? value : applyEffect(value, effect)

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
const switchFunctional = chain.bind(undefined, false)

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
