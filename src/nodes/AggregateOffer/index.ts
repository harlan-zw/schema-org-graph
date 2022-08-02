import type { NodeRelations, Thing } from '../../types'
import {
  asArray,
  provideResolver,
  setIfEmpty,
} from '../../utils'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import type { Offer } from '../Offer'
import { offerResolver } from '../Offer'

export interface AggregateOfferLite extends Thing {
  '@type'?: 'AggregateOffer'
  /**
   * The lowest price of the group, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  lowPrice: number
  /**
   *  The highest price of the group, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  highPrice: number
  /**
   * The currency used to describe the product price, in a three-letter ISO 4217 format.
   */
  priceCurrency?: string
  /**
   * The number of offers in the group
   */
  offerCount?: number
  /**
   * An array of Offer pieces, referenced by ID.
   */
  offers: NodeRelations<Offer>
}

export interface AggregateOffer extends AggregateOfferLite {}

export const aggregateOfferResolver = defineSchemaOrgResolver<AggregateOffer>({
  defaults: {
    '@type': 'AggregateOffer',
  },
  resolve(node, ctx) {
    if (node.offers)
      node.offers = resolveRelation(node.offers, ctx, offerResolver)

    setIfEmpty(node, 'offerCount', asArray(node.offers).length)
    return node
  },
})

export const defineAggregateOffer = <T extends AggregateOffer>(input?: T) => provideResolver(input, aggregateOfferResolver)
