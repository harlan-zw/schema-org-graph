import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { defineComment } from './index'

describe('defineComment', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineComment({
          text: 'This is a comment',
          author: {
            name: 'Harlan Wilton',
          },
        }),
      ])

      const { graphNodes } = injectSchemaOrg()
      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/comment/f0AuDJRYrl",
            "@type": "Comment",
            "author": {
              "@id": "https://example.com/#identity",
            },
            "text": "This is a comment",
          },
          {
            "@id": "https://example.com/#identity",
            "@type": "Person",
            "name": "Harlan Wilton",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
