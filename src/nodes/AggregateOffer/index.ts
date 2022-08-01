import type { Optional } from 'utility-types'
import type { DefaultOptionalKeys, IdReference, Thing } from '../../types'
import {
  asArray,
  provideResolver,
  setIfEmpty,
} from '../../utils'
import type { OfferInput } from '../Offer'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import { offerResolver } from '../Offer'

export interface AggregateOffer extends Thing {
  '@type': 'AggregateOffer'
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
  priceCurrency: string
  /**
   * The number of offers in the group
   */
  offerCount: number
  /**
   * An array of Offer pieces, referenced by ID.
   */
  offers: OfferInput[]
}

export type AggregateOfferOptionalKeys = 'priceCurrency' | 'offerCount'
export type AggregateOfferInput = Optional<AggregateOffer, AggregateOfferOptionalKeys> | IdReference

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

export const defineAggregateOffer
  = <T extends AggregateOffer>(input?: Optional<T, DefaultOptionalKeys | AggregateOfferOptionalKeys>) =>
    provideResolver(input, aggregateOfferResolver)
