import type { Arrayable, IdReference, ResolvableDate, Thing } from '../../types'
import type { RatingInput } from '../Rating'
import { ratingResolver } from '../Rating'
import type { ChildPersonInput } from '../Person'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import { personResolver } from '../Person'

export interface Review extends Thing {
  '@type': 'Review'
  /**
   * A title for the review.
   */
  name?: string
  /**
   * The author of the review.
   */
  author: Arrayable<ChildPersonInput> | string
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  reviewRating: Arrayable<RatingInput> | number
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * The date that the review was published, in ISO 8601 date format.
   */
  datePublished?: ResolvableDate
  /**
   * The text content of the review.
   */
  reviewBody?: string
}

export type RelatedReviewInput = Review | IdReference

export const reviewResolver = defineSchemaOrgResolver<Review>({
  defaults: {
    '@type': 'Review',
  },
  inheritMeta: [
    'inLanguage',
  ],
  resolve(review, ctx) {
    if (review.reviewRating)
      review.reviewRating = resolveRelation(review.reviewRating, ctx, ratingResolver) as RatingInput
    if (review.author)
      review.author = resolveRelation(review.author, ctx, personResolver)
    return review
  },
})

