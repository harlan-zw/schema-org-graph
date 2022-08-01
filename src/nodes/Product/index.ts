import { hash } from 'ohash'
import type { Optional } from 'utility-types'
import type { Arrayable, DefaultOptionalKeys, IdReference, Thing } from '../../types'
import {
  IdentityId,
  idReference,
  prefixId,
  provideResolver,
  resolveId, setIfEmpty,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { Person } from '../Person'
import type { Organization } from '../Organization'
import type { RelatedReviewInput } from '../Review'
import { reviewResolver } from '../Review'
import type { ImageInput } from '../Image'
import type { OfferInput } from '../Offer'
import type { AggregateRatingInput } from '../AggregateRating'
import { aggregateRatingResolver } from '../AggregateRating'
import type { AggregateOfferInput } from '../AggregateOffer'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import { aggregateOfferResolver } from '../AggregateOffer'
import { offerResolver } from '../Offer'
import { PrimaryArticleId } from '../Article'

/**
 * Any offered product or service.
 * For example: a pair of shoes; a concert ticket; the rental of a car;
 * a haircut; or an episode of a TV show streamed online.
 */
export interface Product extends Thing {
  /**
   * The name of the product.
   */
  name: string
  /**
   * A reference-by-ID to one or more imageObject's which represent the product.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image: Arrayable<ImageInput>
  /**
   *  An array of references-by-ID to one or more Offer or aggregateOffer pieces.
   */
  offers?: OfferInput[]
  /**
   *  A reference to an Organization piece, representing brand associated with the Product.
   */
  brand?: Organization | IdReference
  /**
   * A reference to an Organization piece which represents the WebSite.
   */
  seller?: Organization | IdReference
  /**
   * A text description of the product.
   */
  description?: string
  /**
   * An array of references-by-id to one or more Review pieces.
   */
  review?: Arrayable<RelatedReviewInput>
  /**
   * A merchant-specific identifier for the Product.
   */
  sku?: string
  /**
   * An AggregateRating object.
   */
  aggregateRating?: AggregateRatingInput
  /**
   * An AggregateOffer object.
   */
  aggregateOffer?: AggregateOfferInput
  /**
   * A reference to an Organization piece, representing the brand which produces the Product.
   */
  manufacturer?: Organization | IdReference
}

export const ProductId = '#product'

export const productResolver = defineSchemaOrgResolver<Product>({
  defaults: {
    '@type': 'Product',
  },
  inheritMeta: [
    'description',
    'image',
    { meta: 'title', key: 'name' },
  ],
  resolve(node, ctx) {
    setIfEmpty(node, '@id', prefixId(ctx.meta.canonicalUrl, PrimaryArticleId))
    resolveId(node, ctx.meta.canonicalUrl)
    // provide a default sku
    setIfEmpty(node, 'sku', hash(node.name))
    if (node.aggregateOffer)
      node.aggregateOffer = resolveRelation(node.aggregateOffer, ctx, aggregateOfferResolver)
    if (node.aggregateRating)
      node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver)
    if (node.offers)
      node.offers = resolveRelation(node.offers, ctx, offerResolver)
    if (node.review)
      node.review = resolveRelation(node.review, ctx, reviewResolver)
    return node
  },
  rootNodeResolve(product, { findNode }) {
    const webPage = findNode<WebPage>(PrimaryWebPageId)
    const identity = findNode<Person | Organization>(IdentityId)

    if (identity)
      setIfEmpty(product, 'brand', idReference(identity))

    if (webPage)
      setIfEmpty(product, 'mainEntityOfPage', idReference(webPage))

    return product
  },
})

export const defineProduct
  = <T extends Product>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, productResolver)
