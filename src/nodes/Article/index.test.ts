import { describe, expect, it } from 'vitest'
import { injectSchemaOrg, mockRoute, useSchemaOrg, useSetup } from '../../../.test'
import type { WebPage } from '../WebPage'
import type { Article } from './index'
import { defineArticle, defineOrganization, defineWebPage } from '#provider'

const mockDate = new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0))

const defaultArticleInput = {
  headline: 'test',
  description: 'test',
  image: '/my-image.png',
  datePublished: new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0)),
  dateModified: new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0)),
}

describe('defineArticle', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle(defaultArticleInput),
      ])

      const client = injectSchemaOrg()

      expect(client.graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#article",
            "@type": "Article",
            "dateModified": "2021-11-10T10:10:10.000Z",
            "datePublished": "2021-11-10T10:10:10.000Z",
            "description": "test",
            "headline": "test",
            "image": {
              "@id": "https://example.com/#/schema/image/riaRi7jPJC",
            },
            "inLanguage": "en-AU",
            "thumbnailUrl": "https://example.com/my-image.png",
          },
          {
            "@id": "https://example.com/#/schema/image/riaRi7jPJC",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/my-image.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/my-image.png",
          },
        ]
      `)
    })
  })

  it('inherits attributes from useRoute()', () => {
    mockRoute({
      path: '/test',
      title: 'Article headline',
      description: 'my article description',
      image: '/image.png',
      datePublished: mockDate,
      dateModified: mockDate,
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineArticle(),
        ])

        const client = injectSchemaOrg()

        const article = client.findNode<Article>('#article')

        expect(article?.headline).toEqual('Article headline')
        expect(article?.description).toEqual('my article description')
        expect(article?.image).toMatchInlineSnapshot(`
          {
            "@id": "https://example.com/#/schema/image/9zy4GMmGsY",
          }
        `)

        expect(client.graphNodes.length).toEqual(2)
        expect(client.graphNodes).toMatchInlineSnapshot(`
          [
            {
              "@id": "https://example.com/test/#article",
              "@type": "Article",
              "dateModified": "2021-11-10T10:10:10.000Z",
              "datePublished": "2021-11-10T10:10:10.000Z",
              "description": "my article description",
              "headline": "Article headline",
              "image": {
                "@id": "https://example.com/#/schema/image/9zy4GMmGsY",
              },
              "inLanguage": "en-AU",
              "thumbnailUrl": "https://example.com/image.png",
            },
            {
              "@id": "https://example.com/#/schema/image/9zy4GMmGsY",
              "@type": "ImageObject",
              "contentUrl": "https://example.com/image.png",
              "inLanguage": "en-AU",
              "url": "https://example.com/image.png",
            },
          ]
        `)
      })
    })
  })

  it('can define article with custom fields', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle({
          headline: 'test',
          datePublished: mockDate,
          description: 'test',
          // @ts-expect-error missing
          somethingNew: 'test',
        }),
      ])

      const client = injectSchemaOrg()
      const article = client.findNode<Article & { somethingNew: string }>('#article')

      expect(article?.somethingNew).toEqual('test')
    })
  })

  it('passes Date objects into iso string', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle({
          ...defaultArticleInput,
          datePublished: new Date(Date.UTC(2021, 10, 1, 0, 0, 0)),
          dateModified: new Date(Date.UTC(2022, 1, 1, 0, 0, 0)),
        }),
      ])

      const client = injectSchemaOrg()
      const article = client.findNode<Article>('#article')

      expect(article?.datePublished).toEqual('2021-11-01T00:00:00.000Z')
      expect(article?.dateModified).toEqual('2022-02-01T00:00:00.000Z')
    })
  })

  it('allows overriding the type', () => {
    useSetup(() => {
      useSchemaOrg([
        defineArticle({
          '@type': 'TechArticle',
          ...defaultArticleInput,
          'datePublished': mockDate,
          'dateModified': mockDate,
        }),
      ])

      const client = injectSchemaOrg()
      const article = client.findNode<Article>('#article')

      expect(article?.['@type']).toEqual(['Article', 'TechArticle'])
    })
  })

  it('adds read action to web page', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage(),
        defineArticle(defaultArticleInput),
      ])

      const client = injectSchemaOrg()
      const webpage = client.findNode<WebPage>('#webpage')

      expect(webpage?.potentialAction).toMatchInlineSnapshot(`
        [
          {
            "@type": "ReadAction",
            "target": [
              "https://example.com/",
            ],
          },
        ]
      `)
    })
  })

  it('clones date to web page', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage(),
        defineArticle({
          '@id': '#my-article',
          ...defaultArticleInput,
          'datePublished': mockDate,
          'dateModified': mockDate,
        }),
      ])

      const client = injectSchemaOrg()
      const webpage = client.findNode<WebPage>('#webpage')
      const article = client.findNode<Article>('#my-article')

      expect(webpage?.dateModified).toEqual(article?.dateModified)
      expect(webpage?.datePublished).toEqual(article?.datePublished)
    })
  })

  it('handles custom author', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'Identity',
          logo: 'test.png',
        }),
        defineWebPage(),
        defineArticle({
          ...defaultArticleInput,
          author: [
            {
              name: 'Harlan Wilton',
              url: 'https://harlanzw.com',
            },
          ],
        }),
      ])

      const client = injectSchemaOrg()
      const articleNode = client.findNode<Article>('#article')

      expect(articleNode).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#article",
          "@type": "Article",
          "author": {
            "@id": "https://example.com/#/schema/person/xwVZGAwW3S",
          },
          "dateModified": "2021-11-10T10:10:10.000Z",
          "datePublished": "2021-11-10T10:10:10.000Z",
          "description": "test",
          "headline": "test",
          "image": {
            "@id": "https://example.com/#/schema/image/riaRi7jPJC",
          },
          "inLanguage": "en-AU",
          "isPartOf": {
            "@id": "https://example.com/#webpage",
          },
          "mainEntityOfPage": {
            "@id": "https://example.com/#webpage",
          },
          "publisher": {
            "@id": "https://example.com/#identity",
          },
          "thumbnailUrl": "https://example.com/my-image.png",
        }
      `)

      // @ts-expect-error untyped
      const id = articleNode.author['@id']

      expect(id).toEqual('https://example.com/#/schema/person/xwVZGAwW3S')

      const person = client.findNode('https://example.com/#/schema/person/xwVZGAwW3S')
      expect(person).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#/schema/person/xwVZGAwW3S",
          "@type": "Person",
          "name": "Harlan Wilton",
          "url": "https://harlanzw.com",
        }
      `)
    })
  })

  it('handles custom authors', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'Identity',
          logo: '/test.png',
        }),
        defineWebPage(),
        defineArticle({
          ...defaultArticleInput,
          author: [
            {
              name: 'John doe',
              url: 'https://harlanzw.com',
            },
            {
              name: 'Jane doe',
              url: 'https://harlanzw.com',
            },
          ],
        }),
      ])

      const client = injectSchemaOrg()
      const articleNode = client.findNode<Article>('#article')

      // @ts-expect-error untyped
      expect(articleNode.author.length).toEqual(2)

      expect(client.graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#identity",
            "@type": "Organization",
            "logo": {
              "@id": "https://example.com/#logo",
            },
            "name": "Identity",
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://example.com/#identity",
            },
            "dateModified": "2021-11-10T10:10:10.000Z",
            "datePublished": "2021-11-10T10:10:10.000Z",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/",
                ],
              },
            ],
            "primaryImageOfPage": {
              "@id": "https://example.com/#logo",
            },
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#article",
            "@type": "Article",
            "author": [
              {
                "@id": "https://example.com/#/schema/person/xRdko3dItW",
              },
              {
                "@id": "https://example.com/#/schema/person/zhc2uL2FnG",
              },
            ],
            "dateModified": "2021-11-10T10:10:10.000Z",
            "datePublished": "2021-11-10T10:10:10.000Z",
            "description": "test",
            "headline": "test",
            "image": {
              "@id": "https://example.com/#/schema/image/riaRi7jPJC",
            },
            "inLanguage": "en-AU",
            "isPartOf": {
              "@id": "https://example.com/#webpage",
            },
            "mainEntityOfPage": {
              "@id": "https://example.com/#webpage",
            },
            "publisher": {
              "@id": "https://example.com/#identity",
            },
            "thumbnailUrl": "https://example.com/my-image.png",
          },
          {
            "@id": "https://example.com/#logo",
            "@type": "ImageObject",
            "caption": "Identity",
            "contentUrl": "https://example.com/test.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/test.png",
          },
          {
            "@id": "https://example.com/#/schema/person/xRdko3dItW",
            "@type": "Person",
            "name": "John doe",
            "url": "https://harlanzw.com",
          },
          {
            "@id": "https://example.com/#/schema/person/zhc2uL2FnG",
            "@type": "Person",
            "name": "Jane doe",
            "url": "https://harlanzw.com",
          },
          {
            "@id": "https://example.com/#/schema/image/riaRi7jPJC",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/my-image.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/my-image.png",
          },
        ]
      `)
    })
  })

  it('can match yoast schema', () => {
    mockRoute({
      host: 'https://kootingalpecancompany.com/',
      inLanguage: 'en-US',
      path: '/pecan-tree-kootingal',
      title: 'The pecan tree &#8220;Carya illinoinensis&#8221;',
      image: 'https://res.cloudinary.com/kootingalpecancompany/images/w_1920,h_2560/f_auto,q_auto/v1648723707/IMG_0446/IMG_0446.jpg?_i=AA',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineOrganization({
            name: 'Kootingal Pecan Company',
            logo: 'test',
          }),
          defineWebPage(),
        ])

        useSchemaOrg([
          defineArticle({
            wordCount: 381,
            datePublished: '2022-04-06T08:00:51+00:00',
            dateModified: '2022-04-06T08:00:53+00:00',
            author: {
              '@id': '#/schema/person/13c25c1e03aefc2d21fbd03df3d17432',
              'name': 'Mark BT',
            },
            thumbnailUrl: 'https://res.cloudinary.com/kootingalpecancompany/images/w_1920,h_2560/f_auto,q_auto/v1648723707/IMG_0446/IMG_0446.jpg?_i=AA',
            keywords: [
              'certified organic pecans',
              'Kootingal',
              'Orchard',
              'organic nuts',
              'Pecan tree',
            ],
            articleSection: [
              'Organic pecans, activated pecans, single source, Australian organic pecans',
              'Pecan tree',
            ],
          }),
        ])

        const { findNode } = injectSchemaOrg()

        expect(findNode('#article')).toEqual({
          '@type': 'Article',
          '@id': 'https://kootingalpecancompany.com/pecan-tree-kootingal/#article',
          'isPartOf': {
            '@id': 'https://kootingalpecancompany.com/pecan-tree-kootingal/#webpage',
          },
          'author': {
            '@id': 'https://kootingalpecancompany.com/#/schema/person/13c25c1e03aefc2d21fbd03df3d17432',
          },
          'headline': 'The pecan tree &#8220;Carya illinoinensis&#8221;',
          'dateModified': '2022-04-06T08:00:53.000Z',
          'datePublished': '2022-04-06T08:00:51.000Z',
          'mainEntityOfPage': {
            '@id': 'https://kootingalpecancompany.com/pecan-tree-kootingal/#webpage',
          },
          'wordCount': 381,
          'publisher': {
            '@id': 'https://kootingalpecancompany.com/#identity',
          },
          'image': {
            '@id': 'https://kootingalpecancompany.com/#/schema/image/A9Tm9pWwUV',
          },
          'thumbnailUrl': 'https://res.cloudinary.com/kootingalpecancompany/images/w_1920,h_2560/f_auto,q_auto/v1648723707/IMG_0446/IMG_0446.jpg?_i=AA',
          'keywords': [
            'certified organic pecans',
            'Kootingal',
            'Orchard',
            'organic nuts',
            'Pecan tree',
          ],
          'articleSection': [
            'Organic pecans, activated pecans, single source, Australian organic pecans',
            'Pecan tree',
          ],
          'inLanguage': 'en-US',
        })
      })
    })
  })
})
