import { defineSchemaOrgResolver } from '../../../core'
import type { Thing } from '../../../types'

/**
 * An answer offered to a question; perhaps correct, perhaps opinionated or wrong.
 */
export interface Answer extends Thing {
  text: string
}

export const answerResolver = defineSchemaOrgResolver<Answer>({
  cast(node) {
    if (typeof node === 'string') {
      return {
        text: node,
      }
    }
    return node
  },
  defaults: {
    '@type': 'Answer',
  },
})
