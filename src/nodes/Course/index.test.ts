import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { defineCourse, defineOrganization } from '#provider'

describe('defineCourse', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineCourse({
          name: 'Introduction to Computer Science and Programming',
          description: 'Introductory CS course laying out the basics.',
          provider: {
            name: 'University of Technology - Eureka',
            sameAs: 'http://www.ut-eureka.edu',
          },
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@type": "Course",
            "description": "Introductory CS course laying out the basics.",
            "name": "Introduction to Computer Science and Programming",
            "provider": {
              "@id": "https://example.com/#/schema/organization/CNZC84PK4Y",
            },
          },
          {
            "@id": "https://example.com/#/schema/organization/CNZC84PK4Y",
            "@type": "Organization",
            "name": "University of Technology - Eureka",
            "sameAs": "http://www.ut-eureka.edu",
            "url": "https://example.com/",
          },
        ]
      `)
    })
  })
})
