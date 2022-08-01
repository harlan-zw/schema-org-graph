import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { definePerson } from '../Person'
import { IdentityId, idReference } from '../../utils'
import type { WebSite } from '../WebSite'
import { PrimaryWebSiteId, defineWebSite } from '../WebSite'
import { defineProduct } from './index'

describe('defineProduct', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineProduct({
          name: 'test',
          image: '/product.png',
          offers: [
            { price: 50 },
          ],
          aggregateRating: {
            ratingValue: 88,
            bestRating: 100,
            ratingCount: 20,
          },
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
            "@id": "https://example.com/#article",
            "@type": "Product",
            "aggregateRating": {
              "@type": "AggregateRating",
              "bestRating": 100,
              "ratingCount": 20,
              "ratingValue": 88,
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
