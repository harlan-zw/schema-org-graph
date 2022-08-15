import type { Thing } from '../../../types'
import { defineSchemaOrgResolver } from '../../../core'

export interface VirtualLocationLite extends Thing {
  '@type'?: 'VirtualLocation'
  url: string
}

export type VirtualLocation = VirtualLocationLite

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const virtualLocationResolver = defineSchemaOrgResolver<VirtualLocation>({
  cast(node) {
    if (typeof node === 'string') {
      return {
        url: node,
      }
    }
    return node
  },
  defaults: {
    '@type': 'VirtualLocation',
  },
})
