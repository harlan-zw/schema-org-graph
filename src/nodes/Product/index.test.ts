import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { IdentityId, idReference } from '../../utils'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId } from '../WebSite'
import { defineAggregateRating, definePerson, defineProduct, defineWebSite } from '#provider'

describe('defineProduct', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineProduct({
          name: 'test',
          image: '/product.png',
          offers: [
            50,
          ],
          aggregateRating: defineAggregateRating({
            ratingCount: 88,
            reviewCount: 20,
            ratingValue: '4.5',
          }),
          review: [
            {
              name: 'Awesome product!',
              author: {
                name: 'Harlan Wilton',
              },
              reviewRating: {
                ratingValue: 5,
              },
            },
          ],
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#product",
            "@type": "Product",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingCount": 88,
              "ratingValue": "4.5",
              "reviewCount": 20,
            },
            "image": {
              "@id": "https://example.com/#/schema/image/ib91aBv9JW",
            },
            "name": "test",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "price": 50,
              "priceValidUntil": "2023-12-30T00:00:00.000Z",
              "url": "https://example.com/",
            },
            "review": {
              "@type": "Review",
              "author": {
                "@id": "https://example.com/#identity",
                "@type": "Person",
                "name": "Harlan Wilton",
              },
              "inLanguage": "en-AU",
              "name": "Awesome product!",
              "reviewRating": {
                "@type": "Rating",
                "bestRating": 5,
                "ratingValue": 5,
                "worstRating": 1,
              },
            },
            "sku": "n4bQgYhMfW",
          },
          {
            "@id": "https://example.com/#/schema/image/ib91aBv9JW",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/product.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/product.png",
          },
        ]
      `)
    })
  })

  it('sets up publisher as identity', () => {
    useSetup(() => {
      useSchemaOrg([
        definePerson({
          name: 'Harlan Wilton',
          image: '/image/me.png',
        }),
        defineWebSite({
          name: 'test',
        }),
      ])

      const { findNode } = injectSchemaOrg()

      const website = findNode<WebSite>(PrimaryWebSiteId)
      const identity = findNode<WebSite>(IdentityId)

      expect(website?.publisher).toEqual(idReference(identity!))
    })
  })
})
