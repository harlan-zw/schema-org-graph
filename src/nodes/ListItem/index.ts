import type { Thing } from '../../types'
import {
  resolveUrl,
} from '../../utils'
import { defineSchemaOrgResolver } from '../../core'

/**
 * A list item, e.g. a step in a checklist or how-to description.
 */
export interface ListItemLite extends Thing {
  '@type'?: 'ListItem'
  /**
   *  The name of the page in question, as it appears in the breadcrumb navigation.
   */
  name: string
  /**
   * The unmodified canonical URL of the page in question.
   * - If a relative path is provided, it will be resolved to absolute.
   * - Item is not required for the last entry
   */
  item?: string
  /**
   *  An integer (starting at 1), counting the 'depth' of the page from (including) the homepage.
   */
  position?: number
}

export type ListItem = ListItemLite

export const resolveListItem = defineSchemaOrgResolver<ListItem>({
  cast(node) {
    if (typeof node === 'string') {
      node = {
        name: node,
      }
    }
    return node
  },
  defaults: {
    '@type': 'ListItem',
  },
  resolve(node, ctx) {
    resolveUrl(node, 'item', ctx.meta.canonicalHost)
    return node
  },
})

