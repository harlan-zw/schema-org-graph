import type { Optional } from 'utility-types'
import type { Arrayable, DefaultOptionalKeys, IdReference, Thing } from '../../types'
import {
  idReference,
  provideResolver,
  resolveId,
  setIfEmpty,
} from '../../utils'
import type { Article } from '../Article'
import { PrimaryArticleId } from '../Article'
import type { ChildPersonInput } from '../Person'
import { personResolver } from '../Person'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'

export interface Comment extends Thing {
  /**
   * The textual content of the comment, stripping HTML tags.
   */
  text: string
  /**
   *  A reference by ID to the parent Article (or WebPage, when no Article is present).
   */
  about?: IdReference
  /**
   * A reference by ID to the Person who wrote the comment.
   */
  author: Arrayable<ChildPersonInput>
}

/**
 * Describes a review. Usually in the context of an Article or a WebPage.
 */
export const commentResolver = defineSchemaOrgResolver<Comment>({
  defaults: {
    '@type': 'Comment',
  },
  resolve(node, ctx) {
    resolveId(node, ctx.meta.canonicalUrl)
    if (node.author) {
      node.author = resolveRelation(node.author, ctx, personResolver, {
        root: true,
      })
    }
    return node
  },
  rootNodeResolve(node, { findNode }) {
    const article = findNode<Article>(PrimaryArticleId)
    if (article)
      setIfEmpty(node, 'about', idReference(article))
  },
})

export const defineComment
  = <T extends Comment>(input?: Optional<T, DefaultOptionalKeys>) =>
    provideResolver(input, commentResolver)
