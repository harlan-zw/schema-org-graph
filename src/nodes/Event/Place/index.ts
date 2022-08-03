import type { NodeRelation, Thing } from '../../../types'
import {
  provideResolver,
} from '../../../utils'
import { defineSchemaOrgResolver, resolveRelation } from '../../../core'
import type { PostalAddress } from '../../PostalAddress'
import { addressResolver } from '../../PostalAddress'

export interface PlaceLite extends Thing {
  '@type'?: 'Place'
  name: string
  address: NodeRelation<PostalAddress>
}

export type Place = PlaceLite

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const placeResolver = defineSchemaOrgResolver<Place>({
  defaults: {
    '@type': 'Place',
  },
  resolve(node, ctx) {
    if (node.address)
      node.address = resolveRelation(node.address, ctx, addressResolver)

    return node
  },
})

export const definePlace = <T extends Place>(input?: T) => provideResolver(input, placeResolver)
