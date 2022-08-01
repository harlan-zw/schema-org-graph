import type { Optional } from 'utility-types'
import type { Arrayable, DefaultOptionalKeys, IdReference, Thing } from '../../types'
import {
  idReference,
  prefixId,
  provideResolver,
  resolveId,
  resolveWithBaseUrl, setIfEmpty,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import { defineSchemaOrgResolver } from '../../core'

export interface Image extends Thing {
  '@type': 'ImageObject'
  /**
   * The URL of the image file (e.g., /images/cat.jpg).
   */
  url: string
  /**
   * The fully-qualified, absolute URL of the image file (e.g., https://www.example.com/images/cat.jpg).
   * Note: The contentUrl and url properties are intentionally duplicated.
   */
  contentUrl?: string
  /**
   * A text string describing the image.
   * - Fall back to the image alt attribute if no specific caption field exists or is defined.
   */
  caption?: string
  /**
   * The height of the image in pixels.
   * - Must be used with width.
   */
  height?: number
  /**
   * The width of the image in pixels.
   * - Must be used with height.
   */
  width?: number
  /**
   * The language code for the textual content; e.g., en-GB.
   * - Only needed when providing a caption.
   */
  inLanguage?: string
}

export type SingleImageInput = Image | IdReference | string
export type ImageInput = Arrayable<SingleImageInput>

/**
 * Describes an individual image (usually in the context of an embedded media object).
 */
export const imageResolver = defineSchemaOrgResolver<Image>({
  root: true,
  alias: 'image',
  cast(input) {
    if (typeof input === 'string') {
      input = {
        url: input,
      }
    }
    return input
  },
  defaults: {
    '@type': 'ImageObject',
  },
  inheritMeta: [
    // @todo possibly only do if there's a caption
    'inLanguage',
  ],
  resolve(image, { meta }) {
    image.url = resolveWithBaseUrl(meta.canonicalHost, image.url)
    resolveId(image, meta.canonicalHost)
    setIfEmpty(image, 'contentUrl', image.url)
    // image height and width are required to render
    if (image.height && !image.width)
      delete image.height
    if (image.width && !image.height)
      delete image.width
    return image
  },
  rootNodeResolve(image, { findNode, meta }) {
    const hasPrimaryImage = !!findNode('#primaryimage')
    if (/* options.resolvePrimaryImage && */!hasPrimaryImage) {
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (webPage) {
        image['@id'] = prefixId(meta.canonicalUrl, '#primaryimage')
        setIfEmpty(webPage, 'primaryImageOfPage', idReference(image))
      }
    }
  },
})

export const defineImage
  = <T extends Image>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, imageResolver)
