import { describe, expect, it } from 'vitest'
import { defineOrganization } from '../Organization'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import type { Article } from '../Article'
import { PrimaryArticleId, defineArticle } from '../Article'
import { definePerson } from './index'

describe('definePerson', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        definePerson({
          name: 'test',
          image: '/logo.png',
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "Person",
            "image": {
              "@id": "https://example.com/#/schema/image/7mDWiFHrBp",
            },
            "name": "test",
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#/schema/image/7mDWiFHrBp",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/logo.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/logo.png",
          },
        ]
      `)
    })
  })

  it('will not create duplicate identities if one is provided', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'test',
          logo: '/logo.png',
        }),
      ])

      useSchemaOrg([
        definePerson({
          name: 'harlan wilton',
        }),
      ])

      const client = injectSchemaOrg()
      expect(client.graphNodes[1]['@id']).toEqual('https://example.com/#/schema/person/e0K5pxLOks')
    })
  })

  it('links as article author if article present', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle({
          headline: 'test',
          description: 'test',
          image: '/img.png',
        }),
      ])

      useSchemaOrg([
        definePerson({
          name: 'Author',
        }),
      ])

      const client = injectSchemaOrg()

      const article = client.findNode<Article>(PrimaryArticleId)
      expect(article?.author).toMatchInlineSnapshot(`
          {
            "@id": "https://example.com/#identity",
          }
      `)
    })
  })
})
