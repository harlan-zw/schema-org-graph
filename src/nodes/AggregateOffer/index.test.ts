import { describe, expect, it } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { defineAggregateOffer } from '#provider'

describe('defineAggregateOffer', () => {
  it('can be registered simple', () => {
    useSetup(() => {
      useSchemaOrg([
        defineAggregateOffer({
          lowPrice: 100,
          highPrice: 200,
        }),
      ])

      const client = injectSchemaOrg()

      expect(client.graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@type": "AggregateOffer",
            "highPrice": 200,
            "lowPrice": 100,
            "priceCurrency": "AUD",
          },
        ]
      `)
    })
  })

  it('can be registered offers', () => {
    useSetup(() => {
      useSchemaOrg([
        defineAggregateOffer({
          lowPrice: 100,
          highPrice: 200,
          offers: [
            {
              price: '1.00',
            },
            {
              price: '2.00',
            },
          ],
        }),
      ])

      const client = injectSchemaOrg()

      expect(client.graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@type": "AggregateOffer",
            "highPrice": 200,
            "lowPrice": 100,
            "offerCount": 2,
            "offers": [
              {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "1.00",
                "priceCurrency": "AUD",
                "priceValidUntil": "2023-12-30T00:00:00.000Z",
              },
              {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "2.00",
                "priceCurrency": "AUD",
                "priceValidUntil": "2023-12-30T00:00:00.000Z",
              },
            ],
            "priceCurrency": "AUD",
          },
        ]
      `)
    })
  })
})
