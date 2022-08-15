import type { NodeRelations, Thing } from '../../../types'
import {
  resolveWithBase,
} from '../../../utils'
import type { Video } from '../../Video'
import type { HowToDirection } from '../HowToStepDirection'
import type { Image } from '../../Image'
import { defineSchemaOrgResolver, resolveRelation } from '../../../core'
import { imageResolver } from '../../Image'
import { howToStepDirectionResolver } from '../HowToStepDirection'

export interface HowToStepLite extends Thing {
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
  image?: NodeRelations<Image | string>
  /**
   * A video for this step or a clip of the video.
   */
  video?: NodeRelations<Video | string>
  /**
   * A list of detailed substeps, including directions or tips.
   */
  itemListElement?: NodeRelations<HowToDirection | string>[]
}

export type HowToStep = HowToStepLite

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const howToStepResolver = defineSchemaOrgResolver<HowToStep>({
  cast(node) {
    if (typeof node === 'string') {
      return {
        text: node,
      }
    }
    return node
  },
  defaults: {
    '@type': 'HowToStep',
  },
  resolve(step, ctx) {
    if (step.url)
      step.url = resolveWithBaseUrl(ctx.meta.url, step.url)
    if (step.image) {
      step.image = resolveRelation(step.image, ctx, imageResolver, {
        root: true,
      })
    }
    if (step.itemListElement)
      step.itemListElement = resolveRelation(step.itemListElement, ctx, howToStepDirectionResolver)
    return step
  },
})
