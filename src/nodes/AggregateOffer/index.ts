import { hash } from 'ohash'
import type { Arrayable, IdReference, OptionalAtKeys, SchemaOrgContext, Thing } from '../../types'
import {
  prefixId,
  resolveArrayable, setIfEmpty,
} from '../../utils'
import type { OfferInput } from '../Offer'
import { resolveOffer } from '../Offer'
import {defineSchemaOrgNode, resolveSchemaResolver} from "../../core";

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
export type AggregateOfferInput = OptionalAtKeys<AggregateOffer, AggregateOfferOptionalKeys> | IdReference

export function defineAggregateOffer<T extends AggregateOffer, Optional = AggregateOfferOptionalKeys>(input: OptionalAtKeys<AggregateOffer, Optional>) {
  setIfEmpty(input, '@type', 'AggregateOffer')
  input._resolver = aggregateOfferResolver
  return input
}

export const aggregateOfferResolver = defineSchemaOrgNode<AggregateOffer>({
  defaults(ctx) {
    return {
      '@type': 'AggregateOffer'
    }
  },
  resolve(node, ctx) {
    setIfEmpty('@id', prefixId(ctx.canonicalHost, `#/schema/aggregate-offer/${hash(node)}`))
    if (node.offers) {
      // @todo fix type
      node.offers = resolveOffer(ctx, node.offers) as OfferInput[]
    }
    setIfEmpty(node, 'offerCount', Array.isArray(node.offers) ? node.offers.length : 1)
    return node
  },
})

export function resolveAggregateOffer(ctx: SchemaOrgContext, input: Arrayable<AggregateOfferInput>) {
  return resolveArrayable<AggregateOfferInput, AggregateOffer>(input, input => resolveSchemaResolver(ctx, aggregateOfferResolver(input)))
}

