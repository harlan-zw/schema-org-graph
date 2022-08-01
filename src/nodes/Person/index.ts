import type { Optional } from 'utility-types'
import type { DefaultOptionalKeys, IdReference, Thing } from '../../types'
import {
  IdentityId,
  idReference,
  prefixId,
  provideResolver, resolveAsGraphKey, resolveId, setIfEmpty,
} from '../../utils'
import type { ImageInput } from '../Image'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId } from '../WebSite'
import type { Article } from '../Article'
import { PrimaryArticleId } from '../Article'
import type { Organization } from '../Organization'
import { defineSchemaOrgResolver } from '../../core'

/**
 * A person (alive, dead, undead, or fictional).
 */
export interface Person extends Thing {
  /**
   * The full name of the Person.
   */
  name: string
  /**
   * The user bio, truncated to 250 characters.
   */
  description?: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the person
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the person, referenced by ID.
   */
  image?: ImageInput
  /**
   * The URL of the users' profile page (if they're affiliated with the site in question),
   * or to their personal homepage/website.
   */
  url?: string
}

export type ChildPersonInput = Optional<Person, '@type'> | IdReference

/**
 * Describes an individual person. Most commonly used to identify the author of a piece of content (such as an Article or Comment).
 */
export const personResolver = defineSchemaOrgResolver<Person>({
  root: true,
  cast(node) {
    if (typeof node === 'string') {
      return {
        name: node,
      }
    }
    return node
  },
  defaults: {
    '@type': 'Person',
  },
  resolve(node, { meta, findNode }) {
    resolveId(node, meta.canonicalHost)
    // create id if not set
    if (!node['@id']) {
      // may be re-registering the primary person
      const identity = findNode<Person | Organization>(IdentityId)
      if (!identity)
        node['@id'] = prefixId(meta.canonicalHost, IdentityId)
    }
    return node as Person
  },
  rootNodeResolve(node, { findNode, meta }) {
    // if this person is the identity
    if (resolveAsGraphKey(node['@id'] || '') === IdentityId) {
      setIfEmpty(node, 'url', meta.canonicalHost)

      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (webPage)
        setIfEmpty(webPage, 'about', idReference(node as Person))

      const webSite = findNode<WebSite>(PrimaryWebSiteId)
      if (webSite)
        setIfEmpty(webSite, 'publisher', idReference(node))
    }
    // add ourselves as the author
    const article = findNode<Article>(PrimaryArticleId)
    if (article)
      setIfEmpty(article, 'author', idReference(node))
  },
})

export const definePerson
  = <T extends Person>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, personResolver)
