import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { IdentityId, idReference, prefixId } from '../../utils'
import type { WebSite } from './index'
import { PrimaryWebSiteId } from './index'
import { defineOrganization, definePerson, defineSearchAction, defineWebPage, defineWebSite } from '#provider'

describe('defineWebSite', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'test',
        }),
      ])

      const client = injectSchemaOrg()

      expect(client.graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "inLanguage": "en-AU",
            "name": "test",
            "url": "https://example.com/",
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

  it('can set search action', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'test',
          potentialAction: [
            defineSearchAction({
              target: '/search?query={search_term_string}',
            }),
          ],
        }),
      ])

      const { findNode } = injectSchemaOrg()

      const website = findNode<WebSite>(PrimaryWebSiteId)

      expect(website?.potentialAction).toMatchInlineSnapshot(`
        [
          {
            "@type": "SearchAction",
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueName": "search_term_string",
              "valueRequired": true,
            },
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://example.com/search?query={search_term_string}",
            },
          },
        ]
      `)
      expect(website?.potentialAction).toBeDefined()
      // @ts-expect-error weird typing
      expect(website?.potentialAction?.[0]?.target.urlTemplate).toEqual('https://example.com/search?query={search_term_string}')
    })
  })

  it('can set search action - flat', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'test',
          potentialAction:
            defineSearchAction({
              target: '/search?query={search_term_string}',
            }),
        }),
      ])

      const { findNode } = injectSchemaOrg()

      const website = findNode<WebSite>(PrimaryWebSiteId)

      expect(website?.potentialAction).toMatchInlineSnapshot(`
        [
          {
            "@type": "SearchAction",
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueName": "search_term_string",
              "valueRequired": true,
            },
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://example.com/search?query={search_term_string}",
            },
          },
        ]
      `)
      expect(website?.potentialAction).toBeDefined()
      // @ts-expect-error weird typing
      expect(website?.potentialAction?.[0]?.target.urlTemplate).toEqual('https://example.com/search?query={search_term_string}')
    })
  })

  it('can handle multiple websites', () => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'test',
        }),
      ])
      useSchemaOrg([
        defineWebSite({
          name: 'test 2',
        }),
      ])

      const ctx = injectSchemaOrg()
      expect(ctx.graphNodes.length).toEqual(1)
      expect(ctx.graphNodes[0]['@id']).toBe('https://example.com/#website')
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

      const { findNode } = injectSchemaOrg()
      const webSite = findNode<WebSite>(PrimaryWebSiteId)
      expect(webSite?.publisher).toEqual(idReference(prefixId('https://example.com/', IdentityId)))
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
      const webSite = findNode<WebSite>(PrimaryWebSiteId)
      expect(webSite?.publisher).toEqual(idReference(prefixId('https://example.com/', IdentityId)))
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
      const webSite = findNode<WebSite>(PrimaryWebSiteId)
      expect(webSite?.publisher).toEqual(idReference(prefixId('https://example.com/', IdentityId)))
    })
  })
})
