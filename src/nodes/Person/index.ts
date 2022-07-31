import { hash } from 'ohash'
import type { Arrayable, IdReference, OptionalAtKeys, SchemaOrgContext, Thing } from '../../types'
import {
  IdentityId,
  dedupeMerge,
  idReference,
  prefixId,
  resolveArrayable, resolveId, resolveNodesGraphKey,  setIfEmpty,
} from '../../utils'
import type { ImageInput } from '../Image'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId } from '../WebSite'
import type { Article } from '../Article'
import { PrimaryArticleId } from '../Article'
import type { Organization } from '../Organization'
import {defineSchemaOrgNode} from "../../core";

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

export type ChildPersonInput = OptionalAtKeys<Person> | IdReference

export function definePerson<T extends Person, Optional>(input: OptionalAtKeys<T, Optional>) {
  setIfEmpty(input, '@type', 'Person')
  input._resolver = personRootResolver
  return input
}

/**
 * Describes an individual person. Most commonly used to identify the author of a piece of content (such as an Article or Comment).
 */
export const personRootResolver = defineSchemaOrgNode<Person>({
  resolve(node, {canonicalHost, findNode}) {
    resolveId(node, canonicalHost)
    // create id if not set
    if (!node['@id']) {
      // may be re-registering the primary person
      const identity = findNode<Person | Organization>(IdentityId)
      if (!identity)
        node['@id'] = prefixId(canonicalHost, IdentityId)
      else
        node['@id'] = prefixId(canonicalHost, `#/schema/person/${hash(node.name)}`)
    }
    return node as Person
  },
  rootNodeResolve(node, {findNode, nodes, canonicalHost}) {
    console.log('resolving Person as root node')
    // if this person is the identity
    if (resolveNodesGraphKey(node['@id'] || '') === IdentityId) {
      setIfEmpty(node, 'url', canonicalHost)

      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (webPage)
        setIfEmpty(webPage, 'about', idReference(node as Person))

      const webSite = findNode<WebSite>(PrimaryWebSiteId)
      if (webSite)
        setIfEmpty(webSite, 'publisher', idReference(node))
    }
    // add ourselves as the author
    const article = findNode<Article>(PrimaryArticleId)
    console.log('article', article, nodes)
    if (article)
      setIfEmpty(article, 'author', idReference(node))
  },
})

export function resolvePerson(ctx: SchemaOrgContext, input: Arrayable<ChildPersonInput>) {
  return resolveArrayable<ChildPersonInput, IdReference>(input, (input) => {
    setIfEmpty(input, '@id', prefixId(ctx.canonicalHost, `#/schema/person/${hash(input.name)}`))
    const person = personRootResolver(definePerson(input)).resolve(ctx)
    ctx.addNode(person, ctx)
    return idReference(person['@id'])
  })
}


