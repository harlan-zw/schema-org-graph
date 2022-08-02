import { expect } from 'vitest'
import { injectSchemaOrg, useSchemaOrg, useSetup } from '../../../.test'
import { defineRecipe } from './index'

describe('defineRecipe', () => {
  it('can be defined', () => {
    useSetup(() => {
      useSchemaOrg([
        defineRecipe({
          name: 'Peanut Butter Cookies',
          image: 'https://example.com/photos/1x1/photo.jpg',
          recipeInstructions: [
            'Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout',
            'Eat them up',
          ],
          recipeIngredient: ['Peanut Butter', 'Cookie Dough'],
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#recipe",
            "@type": "Recipe",
            "image": {
              "@id": "https://example.com/#/schema/image/0eC6Cg3aVx",
            },
            "name": "Peanut Butter Cookies",
            "recipeIngredient": [
              "Peanut Butter",
              "Cookie Dough",
            ],
            "recipeInstructions": [
              {
                "@type": "HowToStep",
                "text": "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout",
              },
              {
                "@type": "HowToStep",
                "text": "Eat them up",
              },
            ],
          },
          {
            "@id": "https://example.com/#/schema/image/0eC6Cg3aVx",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/photos/1x1/photo.jpg",
            "inLanguage": "en-AU",
            "url": "https://example.com/photos/1x1/photo.jpg",
          },
        ]
      `)
    })
  })
})
