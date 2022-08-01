import type { Optional } from 'utility-types'
import type {DefaultOptionalKeys, Id, ResolvableDate, Thing} from '../../types'
import {
  asArray,
  provideResolver,
  resolveDateToIso,
  resolveId,
  resolveWithBaseUrl, setIfEmpty,
} from '../../utils'
import type { Image } from '../Image'
import { defineSchemaOrgResolver } from '../../core'

export interface Video extends Thing {
  '@type': 'VideoObject'
  /**
   * The title of the video.
   */
  name: string
  /**
   * A description of the video (falling back to the caption, then to 'No description').
   */
  description: string
  /**
   * A reference-by-ID to an imageObject.
   */
  thumbnailUrl: string
  /**
   * The date the video was published, in ISO 8601 format (e.g., 2020-01-20).
   */
  uploadDate: ResolvableDate
  /**
   * Whether the video should be considered 'family friendly'
   */
  isFamilyFriendly?: boolean
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
  /**
   * The duration of the video in ISO 8601 format.
   */
  duration?: string
  /**
   * A URL pointing to a player for the video.
   */
  embedUrl?: string
}

/**
 * Describes an individual video (usually in the context of an embedded media object).
 */
export const videoResolver = defineSchemaOrgResolver<Video>({
  alias: 'video',
  defaults: {
    '@type': 'VideoObject',
  },
  inheritMeta: [
    { meta: 'title', key: 'name' },
    'description',
    'image',
    'inLanguage',
    { meta: 'publishedAt', key: 'uploadDate' },
  ],
  resolve(video, { meta }) {
    if (video.uploadDate)
      video.uploadDate = resolveDateToIso(video.uploadDate)
    video.url = resolveWithBaseUrl(meta.canonicalHost, video.url)
    resolveId(video, meta.canonicalHost)
    return video
  },
  rootNodeResolve(video, { findNode }) {
    if (video.image && !video.thumbnailUrl) {
      const firstImage = asArray(video.image)[0] as Image
      setIfEmpty(video, 'thumbnailUrl', findNode<Image>(firstImage['@id'] as Id)?.url)
    }
  },
})

export const defineVideo
  = <T extends Video>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, videoResolver)
