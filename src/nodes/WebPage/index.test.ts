import { expect } from 'vitest'
import { injectSchemaOrg, mockRoute, useSchemaOrg, useSetup } from '../../../.test'
import { PrimaryWebSiteId } from '../WebSite'
import { IdentityId, idReference, prefixId } from '../../utils'
import type { WebPage } from './index'
import { PrimaryWebPageId } from './index'
import { defineOrganization, defineWebPage, defineWebSite } from '#provider'

const mockDate = new Date(Date.UTC(2021, 10, 10, 10, 10, 10, 0))

describe('defineWebPage', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage({
          name: 'test',
          datePublished: mockDate,
          dateModified: mockDate,
        }),
      ])

      const client = injectSchemaOrg()
      const webPage = client.findNode<WebPage>(PrimaryWebPageId)
      expect(webPage).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#webpage",
          "@type": "WebPage",
          "dateModified": "2021-11-10T10:10:10.000Z",
          "datePublished": "2021-11-10T10:10:10.000Z",
          "name": "test",
          "potentialAction": [
            {
              "@type": "ReadAction",
              "target": [
                "https://example.com/",
              ],
            },
          ],
          "url": "https://example.com/",
        }
      `)
    })
  })

  it('inherits attributes from useRoute()', () => {
    mockRoute({
      path: '/test',
      title: 'headline',
      description: 'description',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPage(),
        ])

        const client = injectSchemaOrg()
        const webPage = client.findNode<WebPage>(PrimaryWebPageId)

        expect(webPage?.name).toEqual('headline')

        expect(webPage).toMatchInlineSnapshot(`
          {
            "@id": "https://example.com/test/#webpage",
            "@type": "WebPage",
            "description": "description",
            "name": "headline",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/test",
                ],
              },
            ],
            "url": "https://example.com/test",
          }
        `)
      })
    })
  })

  it('passes Date objects into iso string', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage({
          name: 'test',
          datePublished: new Date(Date.UTC(2021, 10, 1, 0, 0, 0)),
          dateModified: new Date(Date.UTC(2022, 1, 1, 0, 0, 0)),
        }),
      ])

      const client = injectSchemaOrg()
      const webPage = client.findNode<WebPage>('#webpage')

      expect(webPage?.datePublished).toEqual('2021-11-01T00:00:00.000Z')
      expect(webPage?.dateModified).toEqual('2022-02-01T00:00:00.000Z')
    })
  })

  it('allows overriding the type', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage({
          '@type': 'FAQPage',
          'name': 'FAQ',
        }),
      ])

      const client = injectSchemaOrg()
      const webPage = client.findNode<WebPage>(PrimaryWebPageId)

      expect(webPage?.['@type']).toEqual(['WebPage', 'FAQPage'])
    })
  })

  it('adds read action to home page', () => {
    mockRoute({
      path: '/',
      title: 'headline',
      description: 'description',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPage(),
        ])

        const client = injectSchemaOrg()
        const webpage = client.findNode<WebPage>(PrimaryWebPageId)

        expect(webpage).toMatchInlineSnapshot(`
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "description": "description",
            "name": "headline",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/",
                ],
              },
            ],
            "url": "https://example.com/",
          }
        `)
      })
    })
  })

  it('as readAction', () => {
    mockRoute({
      path: '/our-pages/about-us',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPage({
            name: 'Webpage',
          }),
        ])

        const client = injectSchemaOrg()
        const webpage = client.findNode<WebPage>(PrimaryWebPageId)

        expect(webpage).toMatchInlineSnapshot(`
          {
            "@id": "https://example.com/our-pages/about-us/#webpage",
            "@type": [
              "WebPage",
              "AboutPage",
            ],
            "name": "Webpage",
            "url": "https://example.com/our-pages/about-us",
          }
        `)
      })
    })
  })

  it('can infer @type from path', () => {
    mockRoute({
      path: '/our-pages/about-us',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPage(),
        ])

        const client = injectSchemaOrg()
        const webpage = client.findNode<WebPage>(PrimaryWebPageId)

        expect(webpage?.['@type']).toMatchInlineSnapshot(`
        [
          "WebPage",
          "AboutPage",
        ]
      `)
      })
    })
  })

  it('allows @type augmentation on matching #id', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage(),
      ])

      let ctx = injectSchemaOrg()
      let webPage = ctx.findNode<WebPage>(PrimaryWebPageId)
      expect(webPage?.['@type']).toEqual('WebPage')

      useSchemaOrg([
        defineWebPage({
          '@type': ['CollectionPage', 'SearchResultsPage'],
        }),
      ])

      ctx = injectSchemaOrg()
      webPage = ctx.findNode<WebPage>(PrimaryWebPageId)
      expect(webPage?.['@type']).toEqual(['WebPage', 'CollectionPage', 'SearchResultsPage'])
    })
  })

  it('relation resolving works both ways', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebPage(),
      ])

      useSchemaOrg([
        defineOrganization({
          name: 'Harlan Wilton',
          logo: '/logo.png',
        }),
      ])

      useSchemaOrg([
        defineWebSite({
          name: 'Harlan Wilton',
        }),
      ])

      const { findNode, graphNodes } = injectSchemaOrg()
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      expect(webPage?.about).toEqual(idReference(prefixId('https://example.com/', IdentityId)))
      expect(webPage?.isPartOf).toEqual(idReference(prefixId('https://example.com/', PrimaryWebSiteId)))
      expect(webPage?.primaryImageOfPage).toEqual(idReference(prefixId('https://example.com/', '#primaryimage')))

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://example.com/#identity",
            },
            "isPartOf": {
              "@id": "https://example.com/#website",
            },
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/",
                ],
              },
            ],
            "primaryImageOfPage": {
              "@id": "https://example.com/#primaryimage",
            },
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#identity",
            "@type": "Organization",
            "logo": {
              "@id": "https://example.com/#primaryimage",
            },
            "name": "Harlan Wilton",
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "inLanguage": "en-AU",
            "name": "Harlan Wilton",
            "publisher": {
              "@id": "https://example.com/#identity",
            },
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#primaryimage",
            "@type": "ImageObject",
            "caption": "Harlan Wilton",
            "contentUrl": "https://example.com/logo.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/logo.png",
          },
        ]
      `)
      expect(webPage).toMatchInlineSnapshot(`
        {
          "@id": "https://example.com/#webpage",
          "@type": "WebPage",
          "about": {
            "@id": "https://example.com/#identity",
          },
          "isPartOf": {
            "@id": "https://example.com/#website",
          },
          "potentialAction": [
            {
              "@type": "ReadAction",
              "target": [
                "https://example.com/",
              ],
            },
          ],
          "primaryImageOfPage": {
            "@id": "https://example.com/#primaryimage",
          },
          "url": "https://example.com/",
        }
      `)
    })
  })

  it('relation resolving works both ways #2', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'Harlan Wilton',
          logo: '/logo.png',
        }),
      ])

      useSchemaOrg([
        defineWebPage(),
      ])

      useSchemaOrg([
        defineWebSite({
          name: 'Harlan Wilton',
        }),
      ])

      const { findNode } = injectSchemaOrg()
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      expect(webPage?.about).toEqual(idReference(prefixId('https://example.com/', IdentityId)))
      expect(webPage?.isPartOf).toEqual(idReference(prefixId('https://example.com/', PrimaryWebSiteId)))
      expect(webPage?.primaryImageOfPage).toEqual(idReference(prefixId('https://example.com/', '#logo')))
    })
  })

  it('relation resolving works both ways #2', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'Harlan Wilton',
        }),
      ])

      useSchemaOrg([
        defineOrganization({
          name: 'Harlan Wilton',
          logo: '/logo.png',
        }),
      ])

      useSchemaOrg([
        defineWebPage(),
      ])

      const { findNode } = injectSchemaOrg()
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      expect(webPage?.about).toEqual(idReference(prefixId('https://example.com/', IdentityId)))
      expect(webPage?.isPartOf).toEqual(idReference(prefixId('https://example.com/', PrimaryWebSiteId)))
      expect(webPage?.primaryImageOfPage).toEqual(idReference(prefixId('https://example.com/', '#logo')))
    })
  })
})
