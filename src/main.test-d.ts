import { expectAssignable, expectType } from 'tsd'

import switchFunctional, { type Options } from 'switch-functional'

expectType<unknown>(switchFunctional(true))

switchFunctional(true, {})
expectAssignable<Options>({})
