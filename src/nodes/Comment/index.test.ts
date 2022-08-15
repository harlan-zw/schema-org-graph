import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { defineComment } from '#provider'

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
            "@id": "https://example.com/#/schema/comment/V3foSKHFC7",
            "@type": "Comment",
            "author": {
              "@id": "https://example.com/#/schema/person/W64wIB7mRH",
            },
            "text": "This is a comment",
          },
          {
            "@id": "https://example.com/#/schema/person/W64wIB7mRH",
            "@type": "Person",
            "name": "Harlan Wilton",
          },
        ]
      `)
    })
  })
})
