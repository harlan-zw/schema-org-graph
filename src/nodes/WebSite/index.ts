import { hash } from 'ohash'
import type { Arrayable, Identity, NodeRelations, Thing } from '../../types'
import {
  IdentityId,
  idReference,
  prefixId,
  provideResolver,
  resolveAsGraphKey, resolveId, setIfEmpty,
} from '../../utils'
import type { Person } from '../Person'
import type { Organization } from '../Organization'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import type { SearchAction } from './SearchAction'
import { searchActionResolver } from './SearchAction'

/**
 * A WebSite is a set of related web pages and other items typically served from a single web domain and accessible via URLs.
 */
export interface WebSiteLite extends Thing {
  '@type'?: 'WebSite'
  /**
   * The site's home URL (excluding a trailing slash).
   */
  url?: string
  /**
   * The name of the website.
   */
  name: string
  /**
   * A description of the website (e.g., the site's tagline).
   */
  description?: string
  /**
   * A reference-by-ID to the Organization which publishes the WebSite
   * (or an array of Organization and Person in the case that the website represents an individual).
   */
  publisher?: NodeRelations<Identity>
  /**
   * A SearchAction object describing the site's internal search.
   */
  potentialAction?: (SearchAction | unknown)[]
  /**
   * The language code for the WebSite; e.g., en-GB.
   * If the website is available in multiple languages, then output an array of inLanguage values.
   */
  inLanguage?: Arrayable<string>
}

export interface WebSite extends WebSiteLite {}

export const PrimaryWebSiteId = '#website'

export const webSiteResolver = defineSchemaOrgResolver<WebSite>({
  root: true,
  defaults: {
    '@type': 'WebSite',
  },
  inheritMeta: [
    'inLanguage',
    { meta: 'canonicalHost', key: 'url' },
  ],
  resolve(node, ctx) {
    resolveId(node, ctx.meta.canonicalHost)
    // create id if not set
    if (!node['@id']) {
      // may be re-registering the primary website
      const primary = ctx.findNode<WebPage>(PrimaryWebSiteId)
      if (!primary || hash(primary?.name) === hash(node.name))
        node['@id'] = prefixId(ctx.meta.canonicalHost, PrimaryWebSiteId)
    }
    // actions may be a function that need resolving
    if (node.potentialAction) {
      node.potentialAction = resolveRelation(node.potentialAction, ctx, searchActionResolver, {
        array: true,
      })
    }
    return node
  },
  rootNodeResolve(node, { findNode }) {
    // if this person is the identity
    if (resolveAsGraphKey(node['@id'] || '') === PrimaryWebSiteId) {
      const identity = findNode<Person | Organization>(IdentityId)
      if (identity)
        setIfEmpty(node, 'publisher', idReference(identity))

      const webPage = findNode<WebPage>(PrimaryWebPageId)

      if (webPage)
        setIfEmpty(webPage, 'isPartOf', idReference(node))
    }
    return node
  },
})

export const defineWebSite = <T extends WebSite>(input?: T) => provideResolver(input, webSiteResolver)

export * from './SearchAction'
