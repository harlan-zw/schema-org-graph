import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, OptionalAtKeys, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  prefixId,
  resolveArrayable, resolveSchemaResolver,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

export interface Rating extends Thing {
  '@type': 'Rating'
  /**
   * A numerical quality rating for the item, either a number, fraction, or percentage
   * (for example, "4", "60%", or "6 / 10").
   * Google understands the scale for fractions and percentages,
   * since the scale is implied in the fraction itself or the percentage.
   * The default scale for numbers is a 5-point scale, where 1 is the lowest value and 5 is the highest value.
   * If another scale is intended, use bestRating and worstRating.
   */
  ratingValue: number | string
  /**
   * The highest value allowed in this rating system. If bestRating is omitted, 5 is assumed.
   */
  bestRating?: number
  /**
   * The lowest value allowed in this rating system. If worstRating is omitted, 1 is assumed.
   */
  worstRating?: number
}

export type RatingInput = OptionalAtKeys<Rating> | IdReference

export function defineRating<T extends OptionalAtKeys<Rating>>(input: T) {
  return defineSchemaResolver<T, Rating>(input, {
    defaults(ctx) {
      return {
        '@type': 'Rating',
        '@id': prefixId(ctx.canonicalHost, `#/schema/rating/${hash(input)}`),
        'bestRating': 5,
        'worstRating': 1,
      }
    },
  })
}

export function resolveRating(ctx: SchemaOrgContext, input: Arrayable<RatingInput>) {
  return resolveArrayable<RatingInput, Rating>(input, input => resolveSchemaResolver(ctx, defineRating(input)))
}


