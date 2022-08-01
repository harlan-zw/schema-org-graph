import { describe, expect, it } from 'vitest'
import { injectSchemaOrg, mockRoute, useSchemaOrg, useSetup } from '../../../.test'
import { defineWebPage } from '../WebPage'
import { defineQuestion } from './index'

describe('defineQuestion', () => {
  it('can be registered', () => {
    mockRoute({
      canonicalUrl: 'https://example.com/frequently-asked-questions',
      title: 'FAQ',
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPage({
            '@type': 'FAQPage',
          }),
          defineQuestion({
            name: 'How long is a piece of string?',
            acceptedAnswer: 'Long',
          }),
          defineQuestion({
            name: 'Why do we ask questions?',
            acceptedAnswer: 'To get an accepted answer',
          }),
        ])

        const { graphNodes } = injectSchemaOrg()

        expect(graphNodes).toMatchInlineSnapshot(`
          [
            {
              "@id": "https://example.com/frequently-asked-questions/#webpage",
              "@type": [
                "WebPage",
                "FAQPage",
              ],
              "mainEntity": [
                undefined,
                {
                  "@id": "https://example.com/frequently-asked-questions/#/schema/question/Bj70jLX1Qs",
                },
                {
                  "@id": "https://example.com/frequently-asked-questions/#/schema/question/Md0T0PnU1O",
                },
              ],
              "name": "FAQ",
              "url": "https://example.com/frequently-asked-questions",
            },
            {
              "@id": "https://example.com/frequently-asked-questions/#/schema/question/Bj70jLX1Qs",
              "@type": "Question",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Long",
              },
              "inLanguage": "en-AU",
              "name": "How long is a piece of string?",
            },
            {
              "@id": "https://example.com/frequently-asked-questions/#/schema/question/Md0T0PnU1O",
              "@type": "Question",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To get an accepted answer",
              },
              "inLanguage": "en-AU",
              "name": "Why do we ask questions?",
            },
          ]
        `)
      })
    })
  })
})
