import type { Thing } from '../../types'
import {
  idReference,
  prefixId, provideResolver,
  resolveId,
  setIfEmpty,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { ListItem, ListItemInput } from '../ListItem'
import { resolveListItem } from '../ListItem'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'

/**
 * A BreadcrumbList is an ItemList consisting of a chain of linked Web pages,
 * typically described using at least their URL and their name, and typically ending with the current page.
 */
export interface Breadcrumb extends Thing {
  '@type': 'BreadcrumbList'
  /**
   * Resolved breadcrumb list
   */
  itemListElement: ListItemInput[]
  /**
   * Type of ordering (e.g. Ascending, Descending, Unordered).
   *
   * @default undefined
   */
  itemListOrder?: 'Ascending' | 'Descending' | 'Unordered'
  /**
   * The number of items in an ItemList.
   * Note that some descriptions might not fully describe all items in a list (e.g., multi-page pagination);
   * in such cases, the numberOfItems would be for the entire list.
   *
   * @default undefined
   */
  numberOfItems?: number
}

export type BreadcrumbItem = ListItem

export const PrimaryBreadcrumbId = '#breadcrumb'

/**
 * Describes the hierarchical position a WebPage within a WebSite.
 */
export const breadcrumbResolver = defineSchemaOrgResolver<Breadcrumb>({
  defaults: {
    '@type': 'BreadcrumbList',
  },
  resolve(breadcrumb, ctx) {
    setIfEmpty(breadcrumb, '@id', prefixId(ctx.meta.canonicalUrl, PrimaryBreadcrumbId))
    resolveId(breadcrumb, ctx.meta.canonicalUrl)
    if (breadcrumb.itemListElement) {
      let index = 1

      breadcrumb.itemListElement = resolveRelation(breadcrumb.itemListElement, ctx, resolveListItem, {
        array: true,
        afterResolve(node) {
          setIfEmpty(node, 'position', index++)
        },
      })
    }
    return breadcrumb
  },
  rootNodeResolve(breadcrumb, { findNode }) {
    // merge breadcrumbs reference into the webpage
    const webPage = findNode<WebPage>(PrimaryWebPageId)
    if (webPage)
      setIfEmpty(webPage, 'breadcrumb', idReference(breadcrumb))
  },
})

export const defineBreadcrumb
  = <T extends Breadcrumb>(input?: T) =>
    provideResolver(input, breadcrumbResolver)
