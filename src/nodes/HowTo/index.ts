import type { Optional } from 'utility-types'
import type { DefaultOptionalKeys, IdReference, Thing } from '../../types'
import {
  idReference,
  prefixId,
  provideResolver,
  resolveId, setIfEmpty,
} from '../../utils'
import { PrimaryWebPageId } from '../WebPage'
import type { Video } from '../Video'
import type { ImageInput } from '../Image'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import type { HowToStepInput } from './HowToStep'
import { howToStepResolver } from './HowToStep'

/**
 * Instructions that explain how to achieve a result by performing a sequence of steps.
 */
export interface HowTo extends Thing {
  /**
   * A string describing the guide.
   */
  name: string
  /**
   * An array of howToStep objects
   */
  step: HowToStepInput[]
  /**
   * Referencing the WebPage by ID.
   */
  mainEntityOfPage?: IdReference
  /**
   * The total time required to perform all instructions or directions (including time to prepare the supplies),
   * in ISO 8601 duration format.
   */
  totalTime?: string
  /**
   * Introduction or description content relating to the HowTo guide.
   */
  description?: string
  /**
   * The language code for the guide; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * The estimated cost of the supplies consumed when performing instructions.
   */
  estimatedCost?: string | unknown
  /**
   * Image of the completed how-to.
   */
  image?: ImageInput
  /**
   * A supply consumed when performing instructions or a direction.
   */
  supply?: string | unknown
  /**
   * An object used (but not consumed) when performing instructions or a direction.
   */
  tool?: string | unknown
  /**
   * A video of the how-to. Follow the list of required and recommended Video properties.
   * Mark steps of the video with hasPart.
   */
  video?: IdReference | Video
}

export const HowToId = '#howto'

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const howToResolver = defineSchemaOrgResolver<HowTo>({
  defaults: {
    '@type': 'HowTo',
  },
  inheritMeta: [
    'description',
    'image',
    'inLanguage',
    { meta: 'title', key: 'name' },
  ],
  resolve(node, ctx) {
    setIfEmpty(node, '@id', prefixId(ctx.meta.canonicalUrl, HowToId))
    resolveId(node, ctx.meta.canonicalUrl)
    if (node.step)
      node.step = resolveRelation(ctx, node.step, howToStepResolver)
    return node
  },
  rootNodeResolve(node, { findNode }) {
    const webPage = findNode(PrimaryWebPageId)
    if (webPage)
      setIfEmpty(node, 'mainEntityOfPage', idReference(webPage))
  },
})

export const defineHowTo
  = <T extends HowTo>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, howToResolver)

export * from './HowToStep'
export * from './HowToStepDirection'

