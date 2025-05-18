[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/switch-functional)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://unpkg.com/switch-functional?module)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/src/main.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/switch-functional)
[![Minified size](https://img.shields.io/bundlephobia/minzip/switch-functional?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/switch-functional)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Functional switch statement. Strictly typed.

# Examples

## Basic usage

```js
import switchFunctional from 'switch-functional'

const getUserType = (user) =>
  switchFunctional(user.type)
    .case('dev', 'developer')
    .case(['admin', 'owner'], 'administrator')
    .default('unknown')
```

This is equivalent to:

<!-- eslint-disable no-restricted-syntax, no-fallthrough -->

```js
const getUserType = (user) => {
  switch (user.type) {
    case 'dev': {
      return 'developer'
    }

    case 'admin':

    case 'owner': {
      return 'administrator'
    }

    default: {
      return 'unknown'
    }
  }
}
```

## Testing input

```js
const getUserType = (user) =>
  switchFunctional(user)
    .case(isDeveloper, 'developer')
    .case([isAdmin, isOwner], 'admin')
    .default('unknown')
```

This is equivalent to:

```js
const getUserType = (user) => {
  if (isDeveloper(user)) {
    return 'developer'
  }

  if (isAdmin(user) || isOwner(user)) {
    return 'admin'
  }

  return 'unknown'
}
```

## Testing properties

```js
const getUserType = (user) =>
  switchFunctional(user)
    // Checks `user.hasDevProjects === true`
    .case({ hasDevProjects: true }, 'developer')
    // Checks for deep properties
    .case({ devProjectsCount: 0, permissions: { admin: true } }, 'admin')
    .default('unknown')
```

## Returning dynamic values

<!-- eslint-disable no-shadow -->

```js
const getUserType = (user) =>
  switchFunctional(user)
    .case(isDeveloper, (user) => user.developerType)
    .case(isAdmin, (user) => user.adminType)
    .default((user) => user.genericType)
```

# Install

```bash
npm install switch-functional
```

This package works in both Node.js >=18.18.0 and
[browsers](https://raw.githubusercontent.com/ehmicky/dev-tasks/main/src/browserslist).

This is an ES module. It must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`. If TypeScript is used, it must be configured to
[output ES modules](https://www.typescriptlang.org/docs/handbook/esm-node.html),
not CommonJS.

# API

## switchFunctional(input)

`input`: `unknown`\
_Return value_: [`Switch`](#switchcaseconditions-casereturnvalue)

Functional switch statement. This must be chained with
[`.case()`](#switchcaseconditions-casereturnvalue) statements and end with
[`.default()`](#switchdefaultdefaultreturnvalue).

## Switch.case(conditions, caseReturnValue)

`conditions`: [`Condition | Condition[]`](#conditions)\
`caseReturnValue`: `unknown | (input) => unknown`\
_Return value_: [`Switch`](#switchcaseconditions-casereturnvalue)

If the `input` matches the `conditions`, the final return value will be
`caseReturnValue`.

`caseReturnValue` can optionally be a function taking the `input` as argument.

## Switch.default(defaultReturnValue)

`defaultReturnValue`: `unknown | (input) => unknown`\
_Return value_: `unknown`

If one of the [`.case()`](#switchcaseconditions-casereturnvalue) statements
matched, returns its `caseReturnValue`. Else, returns `defaultReturnValue`.

`defaultReturnValue` can optionally be a function taking the `input` as
argument.

## Conditions

The `conditions` can be:

- Any value, checked for equality with
  [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
- An object containing of subset of properties
- A filtering function taking the `input` as argument and returning a boolean
- A boolean
- An array of the above types, checking if _any_ condition in the array matches

# Related projects

- [`modern-errors-switch`](https://github.com/ehmicky/modern-errors-switch):
  Execute class-specific logic

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/switch-functional/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/switch-functional/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
