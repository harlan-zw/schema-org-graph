import { resolveWithBaseUrl } from '../../../utils'
import { defineSchemaOrgResolver } from '../../../core'

export interface SearchActionInput {
  /**
   * An object of type EntryPoint, with a relative URL which describes the URL pattern of the internal search function
   * (e.g., /search?query={search_term_string}).
   */
  target: `${string}{search_term_string}${string | undefined}`
  /**
   * Alias: The search term string as described in the target (e.g., search_term_string).
   * @default search_term_string
   */
  queryInput?: string
}

export interface SearchAction {
  '@type'?: 'SearchAction'
  /**
   * An object of type EntryPoint, with a relative URL which describes the URL pattern of the internal search function
   * (e.g., /search?query={search_term_string}).
   */
  target: {
    '@type'?: 'EntryPoint'
    'urlTemplate': string
  }
  /**
   * The search term string as described in the target (e.g., search_term_string).
   */
  'query-input': {
    '@type'?: 'PropertyValueSpecification'
    'valueRequired': boolean
    'valueName': string
  }
}

export const searchActionResolver = defineSchemaOrgResolver<SearchAction>({
  defaults: {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
    },
    'query-input': {
      '@type': 'PropertyValueSpecification',
      'valueRequired': true,
      'valueName': 'search_term_string',
    },
  },
  resolve(node, ctx) {
    if (typeof node.target === 'string') {
      node.target = {
        '@type': 'EntryPoint',
        'urlTemplate': resolveWithBaseUrl(ctx.meta.host, node.target),
      }
    }
    return node
  },
})

