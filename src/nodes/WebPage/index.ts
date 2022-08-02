import { withoutTrailingSlash } from 'ufo'
import type {
  Arrayable,
  NodeRelation,
  NodeRelations,
  ResolvableDate,
  Thing,
} from '../../types'
import {
  IdentityId,
  idReference, prefixId, provideResolver, resolveDateToIso, resolveId, resolveType, setIfEmpty,
} from '../../utils'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId } from '../WebSite'
import type { Organization } from '../Organization'
import type { Image } from '../Image'
import type { Breadcrumb } from '../Breadcrumb'
import type { Video } from '../Video'
import { PrimaryBreadcrumbId } from '../Breadcrumb'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import type { Person } from '../Person'
import type { ReadAction } from './ReadAction'
import { readActionResolver } from './ReadAction'

type ValidSubTypes = 'WebPage' | 'AboutPage' | 'CheckoutPage' | 'CollectionPage' | 'ContactPage' | 'FAQPage' | 'ItemPage' | 'MedicalWebPage' | 'ProfilePage' | 'QAPage' | 'RealEstateListing' | 'SearchResultsPage'

/**
 * A web page.
 * Every web page is implicitly assumed to be declared to be of type WebPage,
 * so the various properties about that webpage, such as breadcrumb may be used.
 */
export interface WebPageLite extends Thing {
  ['@type']?: Arrayable<ValidSubTypes>
  /**
   * The unmodified canonical URL of the page.
   */
  url?: string
  /**
   * The title of the page.
   */
  name?: string
  /**
   * The page's meta description content.
   */
  description?: string
  /**
   * A reference-by-ID to the WebSite node.
   */
  isPartOf?: NodeRelation<WebSite>
  /**
   * A reference-by-ID to the Organisation node.
   * Note: Only for the home page.
   */
  about?: NodeRelation<Organization>
  /**
   * A reference-by-ID to the author of the web page.
   */
  author?: NodeRelation<Person | string>
  /**
   * The language code for the page; e.g., en-GB.
   */
  inLanguage?: Arrayable<string>
  /**
   * The time at which the page was originally published, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  datePublished?: ResolvableDate
  /**
   * The time at which the page was last modified, in ISO 8601 format; e.g., 2015-10-31T16:10:29+00:00.
   */
  dateModified?: ResolvableDate
  /**
   * A reference-by-ID to a node representing the page's featured image.
   */
  primaryImageOfPage?: NodeRelation<Image | string>
  /**
   * A reference-by-ID to a node representing the page's breadrumb structure.
   */
  breadcrumb?: NodeRelation<Breadcrumb>
  /**
   * An array of all videos in the page content, referenced by ID.
   */
  video?: NodeRelations<Video>
  /**
   * A SpeakableSpecification object which identifies any content elements suitable for spoken results.
   */
  speakable?: unknown
  /**
   * Potential actions for this web page.
   *
   * Note it's on by default for most page types.
   */
  potentialAction?: (ReadAction | unknown)[]
}

export type WebPage = WebPageLite

export const PrimaryWebPageId = '#webpage'

export const webPageResolver = defineSchemaOrgResolver<WebPage>({
  defaults({ meta }) {
    // try match the @type for the canonicalUrl
    const endPath = withoutTrailingSlash(meta.canonicalUrl.substring(meta.canonicalUrl.lastIndexOf('/') + 1))
    let type: ValidSubTypes = 'WebPage'
    switch (endPath) {
      case 'about':
      case 'about-us':
        type = 'AboutPage'
        break
      case 'search':
        type = 'SearchResultsPage'
        break
      case 'checkout':
        type = 'CheckoutPage'
        break
      case 'contact':
      case 'get-in-touch':
      case 'contact-us':
        type = 'ContactPage'
        break
      case 'faq':
        type = 'FAQPage'
        break
    }
    const defaults: Partial<WebPage> = {
      '@type': type,
      '@id': prefixId(meta.canonicalUrl, PrimaryWebPageId),
      'url': meta.canonicalUrl,
    }
    return defaults
  },
  inheritMeta: [
    { meta: 'title', key: 'name' },
    'description',
    'datePublished',
    'dateModified',
  ],
  resolve(node, ctx) {
    resolveId(node, ctx.meta.canonicalUrl)
    if (node.dateModified)
      node.dateModified = resolveDateToIso(node.dateModified)

    if (node.datePublished)
      node.datePublished = resolveDateToIso(node.datePublished)

    if (node['@type'])
      node['@type'] = resolveType(node['@type'], 'WebPage') as Arrayable<ValidSubTypes>

    // actions may be a function that need resolving
    if (node.potentialAction)
      node.potentialAction = resolveRelation(node.potentialAction, ctx, readActionResolver)

    if (node['@type'] === 'WebPage') {
      // if the type hasn't been augmented
      setIfEmpty(node, 'potentialAction', [
        {
          '@type': 'ReadAction',
          'target': [ctx.meta.canonicalUrl],
        },
      ])
    }
    return node
  },
  rootNodeResolve(webPage, { findNode, meta }) {
    const identity = findNode<Person | Organization>(IdentityId)
    const webSite = findNode<WebSite>(PrimaryWebSiteId)
    const logo = findNode<Image>('#logo')

    /*
     * When it's a homepage, add additional about property which references the identity of the site.
     */
    if (identity && meta.canonicalUrl === meta.canonicalHost)
      setIfEmpty(webPage, 'about', idReference(identity))

    if (logo)
      setIfEmpty(webPage, 'primaryImageOfPage', idReference(logo))

    if (webSite)
      setIfEmpty(webPage, 'isPartOf', idReference(webSite))

    // it's possible that adding a new web page will revert the breadcrumb data
    const breadcrumb = findNode<Breadcrumb>(PrimaryBreadcrumbId)
    if (breadcrumb)
      setIfEmpty(webPage, 'breadcrumb', idReference(breadcrumb))

    return webPage
  },
})

export const defineWebPage = <T extends WebPage>(input?: T) => provideResolver(input, webPageResolver)
