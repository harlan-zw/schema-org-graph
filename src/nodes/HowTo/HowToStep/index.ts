import type { Optional } from 'utility-types'
import type { DefaultOptionalKeys, IdReference, Thing } from '../../../types'
import {
  provideResolver, resolveWithBaseUrl,
} from '../../../utils'
import type { Video } from '../../Video'
import type { HowToDirection } from '../HowToStepDirection'
import type { ImageInput } from '../../Image'
import { defineSchemaOrgResolver, resolveRelation } from '../../../core'
import { imageResolver } from '../../Image'
import { howToStepDirectionResolver } from '../HowToStepDirection'

export interface HowToStep extends Thing {
  /**
   * A link to a fragment identifier (an 'ID anchor') of the individual step
   * (e.g., https://www.example.com/example-page/#recipe-step-5).
   */
  url?: string
  /**
   * The instruction string
   * ("e.g., "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout").
   */
  text: string
  /**
   * The word or short phrase summarizing the step (for example, "Attach wires to post" or "Dig").
   * Don't use non-descriptive text (for example, "Step 1: [text]") or other form of step number (for example, "1. [text]").
   */
  name?: string
  /**
   * An image representing the step, referenced by ID.
   */
  image?: ImageInput
  /**
   * A video for this step or a clip of the video.
   */
  video?: Video | IdReference
  /**
   * A list of detailed substeps, including directions or tips.
   */
  itemListElement?: HowToDirection[]
}

export type HowToStepInput = HowToStep

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const howToStepResolver = defineSchemaOrgResolver<HowToStep>({
  defaults: {
    '@type': 'HowToStep',
  },
  resolve(step, ctx) {
    if (step.url)
      step.url = resolveWithBaseUrl(ctx.meta.canonicalUrl, step.url)
    if (step.image) {
      step.image = resolveRelation(ctx, step.image, imageResolver, {
        root: true,
      })
    }
    if (step.itemListElement)
      step.itemListElement = resolveRelation(ctx, step.itemListElement, howToStepDirectionResolver)
    return step
  },
})

export const defineHowToStep
  = <T extends HowToStep>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, howToStepResolver)
