import { hash } from 'ohash'
import type { Arrayable, IdReference, OptionalAtKeys, SchemaOrgContext, Thing } from '../../types'
import type { ResolverOptions } from '../../utils'
import {
  idReference,
  prefixId, resolveArrayable,
  resolveId,
  resolveWithBaseUrl,
  setIfEmpty,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import {defineSchemaOrgNode} from "../../core";

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

export type SingleImageInput = OptionalAtKeys<Image> | IdReference | string
export type ImageInput = Arrayable<OptionalAtKeys<Image> | IdReference | string>

export interface ResolveImagesOptions extends ResolverOptions {
  /**
   * Resolve a primary image from the image list if it's not provided.
   */
  resolvePrimaryImage?: boolean
  /**
   * Whether the image nodes registered should be moved to the root schema graph or kept inline.
   */
  asRootNodes?: boolean
  /**
   * Custom data to merge with the entries
   */
  mergeWith?: Partial<Image>
  /**
   * Return single images as an object
   */
  array?: boolean
}

export function defineImage<T extends Image, Optional>(input: OptionalAtKeys<Image, Optional>) {
  setIfEmpty(input, '@type', 'Image')
  return input
}


/**
 * Describes an individual image (usually in the context of an embedded media object).
 */
export const imageRootResolver = defineSchemaOrgNode<Image>({
  resolve(image, {options, canonicalHost}) {
    image.url = resolveWithBaseUrl(canonicalHost, image.url)
    setIfEmpty(image, '@id', prefixId(canonicalHost, `#/schema/image/${hash(image.url)}`))
    resolveId(image, canonicalHost)
    setIfEmpty(image, 'inLanguage', options.defaultLanguage)
    setIfEmpty(image, 'contentUrl', image.url)
    // image height and width are required to render
    if (image.height && !image.width)
      delete image.height
    if (image.width && !image.height)
      delete image.width
    // set the caption language if we're able to
    if (image.caption && options.defaultLanguage)
      setIfEmpty(image, 'inLanguage', options.defaultLanguage)
    return image
  },
})

function resolveImage(ctx: SchemaOrgContext, options: ResolveImagesOptions = {}) {
  let hasPrimaryImage = false
  return (input: ImageInput) => {
    const { addNode, findNode, canonicalUrl } = ctx
    if (findNode('#primaryimage'))
      hasPrimaryImage = true

    if (typeof input === 'string') {
      input = {
        url: input,
      }
    }
    const imageInput = {
      ...input,
      ...(options.mergeWith ?? {}),
    } as OptionalAtKeys<Image>
    const image = imageRootResolver.resolve(imageInput, ctx)

    if (options.resolvePrimaryImage && !hasPrimaryImage) {
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (webPage) {
        image['@id'] = prefixId(canonicalUrl, '#primaryimage')
        setIfEmpty(webPage, 'primaryImageOfPage', idReference(image))
      }
      hasPrimaryImage = true
    }

    if (options.asRootNodes) {
      addNode(image, ctx)
      return idReference(image['@id'])
    }
    return image
  }
}

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function resolveImages(client: SchemaOrgContext, input: SingleImageInput | ImageInput, options: ResolveImagesOptions = {}) {
  return resolveArrayable<ImageInput, Image>(input, resolveImage(client, options), options)
}


