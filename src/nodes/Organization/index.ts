import { hash } from 'ohash'
import type { NodeRelation, NodeRelations, Thing } from '../../types'
import {
  IdentityId,
  idReference,
  prefixId, resolveAsGraphKey, resolveDefaultType, setIfEmpty,
} from '../../utils'
import type { Image } from '../Image'
import { imageResolver } from '../Image'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId } from '../WebSite'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import type { PostalAddress } from '../PostalAddress'
import { addressResolver } from '../PostalAddress'

/**
 * An organization such as a school, NGO, corporation, club, etc.
 */
export interface OrganizationLite extends Thing {
  /**
   * A reference-by-ID to an image of the organization's logo.
   *
   * - The image must be 112x112px, at a minimum.
   * - Make sure the image looks how you intend it to look on a purely white background
   * (for example, if the logo is mostly white or gray,
   * it may not look how you want it to look when displayed on a white background).
   */
  logo: NodeRelation<Image | string>
  /**
   * The site's home URL.
   */
  url?: string
  /**
   * The name of the Organization.
   */
  name: string
  /**
   * An array of URLs representing declared social/authoritative profiles of the organization
   * (e.g., a Wikipedia page, or Facebook profile).
   */
  sameAs?: string[]
  /**
   * An array of images which represent the organization (including the logo ), referenced by ID.
   */
  image?: NodeRelations<Image | string>
  /**
   * A reference-by-ID to an PostalAddress piece.
   */
  address?: NodeRelations<PostalAddress>
}

export interface Organization extends OrganizationLite {}

/**
 * Describes an organization (a company, business or institution).
 * Most commonly used to identify the publisher of a WebSite.
 *
 * May be transformed into a more specific type
 * (such as Corporation or LocalBusiness) if the required conditions are met.
 */
export const organizationResolver
  = defineSchemaOrgResolver<Organization>({
    defaults: {
      '@type': 'Organization',
    },
    resolve(node, ctx) {
      setIfEmpty(node, 'url', ctx.meta.host)
      resolveId(node, ctx.meta.host)
      // create id if not set
      if (!node['@id']) {
        // may be re-registering the primary website
        const identity = ctx.findNode<Organization>(IdentityId)
        if (!identity || hash(identity?.name) === hash(node.name))
          node['@id'] = prefixId(ctx.meta.host, IdentityId)
      }

      if (node['@type'])
        node['@type'] = resolveType(node['@type'], 'Organization')
      if (node.address)
        node.address = resolveRelation(node.address, ctx, addressResolver)

      const isIdentity = resolveAsGraphKey(node['@id'] || '') === IdentityId
      const webPage = ctx.findNode<WebPage>(PrimaryWebPageId)

      if (node.logo) {
        node.logo = resolveRelation(node.logo, ctx, imageResolver, {
          root: true,
          afterResolve(logo) {
            if (isIdentity)
              logo['@id'] = prefixId(ctx.meta.host, '#logo')
            setIfEmpty(logo, 'caption', node.name)
          },
        })

        if (webPage)
          setIfEmpty(webPage, 'primaryImageOfPage', idReference(node.logo as Image))
      }
      if (isIdentity && webPage)
        setIfEmpty(webPage, 'about', idReference(node as Organization))

      const webSite = ctx.findNode<WebSite>(PrimaryWebSiteId)
      if (webSite)
        setIfEmpty(webSite, 'publisher', idReference(node as Organization))
      return node
    },
  })
