import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { defineAggregateRating, defineMovie, defineReview } from '#provider'

describe('defineMovie', () => {
  it('can be defined', () => {
    useSetup(() => {
      useSchemaOrg([
        defineMovie({
          name: 'Black Panther',
          url: 'https://example.com/2019-best-picture-noms#black-panther',
          image: 'https://example.com/photos/6x9/photo.jpg',
          dateCreated: '2018-02-16',
          director: 'Ryan Coogle',
          review: {
            reviewRating: 2,
            author: 'Trevor R',
            reviewBody: 'I didn\'t like the lighting and CGI in this movie.',
          },
          aggregateRating: {
            ratingValue: 96,
            bestRating: 100,
            ratingCount: 88211,
          },
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@type": "Movie",
            "aggregateRating": {
              "@type": "AggregateRating",
              "bestRating": 100,
              "ratingCount": 88211,
              "ratingValue": 96,
            },
            "dateCreated": "2018-1-16",
            "director": {
              "@type": "Person",
              "name": "Ryan Coogle",
            },
            "image": {
              "@id": "https://example.com/#/schema/image/a1sKnqufzD",
            },
            "name": "Black Panther",
            "review": {
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Trevor R",
              },
              "inLanguage": "en-AU",
              "reviewBody": "I didn't like the lighting and CGI in this movie.",
              "reviewRating": {
                "@type": "Rating",
                "bestRating": 5,
                "worstRating": 1,
              },
            },
            "url": "https://example.com/2019-best-picture-noms#black-panther",
          },
          {
            "@id": "https://example.com/#/schema/image/a1sKnqufzD",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/photos/6x9/photo.jpg",
            "inLanguage": "en-AU",
            "url": "https://example.com/photos/6x9/photo.jpg",
          },
        ]
      `)
    })
  })
})
