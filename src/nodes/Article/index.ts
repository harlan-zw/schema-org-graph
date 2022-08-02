import type {
  Arrayable,
  IdReference,
  Identity,
  NodeRelations,
  ResolvableDate,
  Thing,
} from '../../types'
import {
  IdentityId,
  asArray,
  idReference,
  prefixId,
  provideResolver,
  resolveDateToIso,
  resolveId,
  resolveType,
  resolveWithBaseUrl,
  setIfEmpty,
  trimLength,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { Organization } from '../Organization'
import type { Person } from '../Person'
import type { Image } from '../Image'
import type { Video } from '../Video'
import { personResolver } from '../Person'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'

type ValidArticleSubTypes = 'Article' | 'AdvertiserContentArticle' | 'NewsArticle' | 'Report' | 'SatiricalArticle' | 'ScholarlyArticle' | 'SocialMediaPosting' | 'TechArticle'

export interface ArticleLite extends Thing {
  ['@type']?: Arrayable<ValidArticleSubTypes>
  /**
   * The headline of the article (falling back to the title of the WebPage).
   * Headlines should not exceed 110 characters.
   */
  headline?: string
  /**
   * A summary of the article (falling back to the page's meta description content).
   */
  description?: string
  /**
   * A reference-by-ID to the WebPage node.
   */
  isPartOf?: IdReference
  /**
   * The time at which the article was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: ResolvableDate
  /**
   * The time at which the article was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: ResolvableDate
  /**
   * A reference-by-ID to the author of the article.
   */
  author?: NodeRelations<Person>
  /**
   * A reference-by-ID to the publisher of the article.
   */
  publisher?: NodeRelations<Identity>
  /**
   * An array of all videos in the article content, referenced by ID.
   */
  video?: NodeRelations<Video>
  /**
   * An image object or referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   *
   * Must have markup of it somewhere on the page.
   */
  image?: NodeRelations<Image | string>
  /**
   * An array of references by ID to comment pieces.
   */
  comment?: NodeRelations<Comment>
  /**
   * A thumbnail image relevant to the Article.
   */
  thumbnailUrl?: string
  /**
   * An integer value of the number of comments associated with the article.
   */
  commentCount?: number
  /**
   * An integer value of the number of words in the article.
   */
  wordCount?: number
  /**
   * An array of keywords which the article has (e.g., ["cats","dogs","cake"]).
   */
  keywords?: string[]
  /**
   * An array of category names which the article belongs to (e.g., ["cats","dogs","cake"]).
   */
  articleSection?: string[]
  /**
   * The language code for the article; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * The year from which the article holds copyright status.
   */
  copyrightYear?: string
  /**
   * A reference-by-ID to the Organization or Person who holds the copyright.
   */
  copyrightHolder?: NodeRelations<Identity>
}

export interface Article extends ArticleLite {}

export const PrimaryArticleId = '#article'

/**
 * Describes an Article on a WebPage.
 */
export const articleResolver = defineSchemaOrgResolver<Article>({
  defaults: {
    '@type': 'Article',
  },
  inheritMeta: [
    'inLanguage',
    'description',
    'image',
    'dateModified',
    'datePublished',
    { meta: 'title', key: 'headline' },
  ],
  resolve(node, ctx) {
    // @todo check it doesn't exist
    setIfEmpty(node, '@id', prefixId(ctx.meta.canonicalUrl, PrimaryArticleId))
    resolveId(node, ctx.meta.canonicalUrl)
    if (node.author) {
      node.author = resolveRelation(node.author, ctx, personResolver, {
        root: true,
      })
    }
    if (node.dateModified)
      node.dateModified = resolveDateToIso(node.dateModified)
    if (node.datePublished)
      node.datePublished = resolveDateToIso(node.datePublished)
    if (node['@type'])
      node['@type'] = resolveType(node['@type'], 'Article') as Arrayable<ValidArticleSubTypes>
    // Headlines should not exceed 110 characters.
    if (node.headline)
      node.headline = trimLength(node.headline, 110)
    return node
  },
  rootNodeResolve(article, { findNode, meta }) {
    const webPage = findNode<WebPage>(PrimaryWebPageId)
    const identity = findNode<Organization | Person>(IdentityId)

    if (article.image && !article.thumbnailUrl) {
      const firstImage = asArray(article.image)[0] as Image
      if (typeof firstImage === 'string')
        setIfEmpty(article, 'thumbnailUrl', resolveWithBaseUrl(meta.canonicalHost, firstImage))
      else if (firstImage?.['@id'])
        setIfEmpty(article, 'thumbnailUrl', findNode<Image>(firstImage['@id'])?.url)
    }

    if (identity) {
      setIfEmpty(article, 'publisher', idReference(identity))
      setIfEmpty(article, 'author', idReference(identity))
    }

    if (webPage) {
      setIfEmpty(article, 'isPartOf', idReference(webPage))
      setIfEmpty(article, 'mainEntityOfPage', idReference(webPage))
      setIfEmpty(webPage, 'potentialAction', [
        {
          '@type': 'ReadAction',
          'target': [meta.canonicalUrl],
        },
      ])
      // clone the dates to the webpage
      setIfEmpty(webPage, 'dateModified', article.dateModified)
      setIfEmpty(webPage, 'datePublished', article.datePublished)
      // setIfEmpty(webPage, 'author', article.author)
    }
    return article
  },
})

export const defineArticle = <T extends Article>(input?: T) => provideResolver(input, articleResolver)
