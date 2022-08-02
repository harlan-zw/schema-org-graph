import type { ResolvableDate, Thing } from '../../types'
import {
  provideResolver, resolveDateToIso, setIfEmpty,
} from '../../utils'
import { defineSchemaOrgResolver } from '../../core'

export interface OfferLite extends Thing {
  '@type'?: 'Offer'
  /**
   * A schema.org URL representing a schema itemAvailability value (e.g., https://schema.org/OutOfStock).
   */
  availability?: string
  /**
   * The price, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  price: number
  /**
   * The currency used to describe the product price, in three-letter ISO 4217 format.
   */
  priceCurrency?: string
  /**
   * @todo A PriceSpecification object, including a valueAddedTaxIncluded property (of either true or false).
   */
  priceSpecification?: unknown
  /**
   * The date after which the price is no longer available.
   */
  priceValidUntil?: ResolvableDate

  url?: string
}

export interface Offer extends OfferLite {}

export const offerResolver = defineSchemaOrgResolver<Offer>({
  cast(node) {
    if (typeof node === 'number') {
      return {
        price: node,
      }
    }
    return node
  },
  defaults: {
    '@type': 'Offer',
    'availability': 'https://schema.org/InStock',
  },
  resolve(node, ctx) {
    setIfEmpty(node, 'priceCurrency', ctx.meta.defaultCurrency)
    setIfEmpty(node, 'priceValidUntil', new Date(Date.UTC(new Date().getFullYear() + 1, 12, -1, 0, 0, 0)))
    setIfEmpty(node, 'url', ctx.meta.canonicalUrl)

    if (node.priceValidUntil)
      node.priceValidUntil = resolveDateToIso(node.priceValidUntil)
    return node
  },
})

export const defineOffer = <T extends Offer>(input?: T) => provideResolver(input, offerResolver)
