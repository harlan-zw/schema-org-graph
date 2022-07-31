import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, OptionalAtKeys, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  resolveArrayable, resolveSchemaResolver, resolveUrl, setIfEmpty,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

/**
 * An list item, e.g. a step in a checklist or how-to description.
 */
export interface ListItem extends Thing {
  '@type': 'ListItem'
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

export type ListItemInput = OptionalAtKeys<ListItem> | IdReference | string

export function defineListItem<T extends OptionalAtKeys<ListItem>>(input: T) {
  return defineSchemaResolver<T, ListItem>(input, {
    defaults() {
      return {
        '@type': 'ListItem',
      }
    },
  })
}

export function resolveListItems(ctx: SchemaOrgContext, input: Arrayable<ListItemInput>) {
  let index = 1
  return resolveArrayable<ListItemInput, ListItem>(input, (input) => {
    if (typeof input === 'string') {
      input = {
        name: input,
      }
    }
    const listItem = resolveSchemaResolver(ctx, defineListItem(input))
    setIfEmpty(listItem, 'position', index++)
    resolveUrl(listItem, 'item', ctx.canonicalHost)
    return listItem
  }, { array: true })
}


