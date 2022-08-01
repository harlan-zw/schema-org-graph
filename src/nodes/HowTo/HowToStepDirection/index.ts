import type { Optional } from 'utility-types'
import type { DefaultOptionalKeys, Thing } from '../../../types'
import {
  provideResolver,
} from '../../../utils'
import type { HowToStep } from '../HowToStep'
import { defineSchemaOrgResolver } from '../../../core'

export interface HowToDirection extends Thing {
  /**
   * The text of the direction or tip.
   */
  text: string
}

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const howToStepDirectionResolver = defineSchemaOrgResolver<HowToDirection>({
  defaults: {
    '@type': 'HowToDirection',
  },
})

export const defineHowToStepDirection
  = <T extends HowToStep>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, howToStepDirectionResolver)
