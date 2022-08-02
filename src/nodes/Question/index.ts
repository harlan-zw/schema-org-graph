import type { NodeRelation, Thing } from '../../types'
import {
  asArray,
  dedupeMerge,
  idReference,
  provideResolver,
  resolveId,
} from '../../utils'
import { defineSchemaOrgResolver, resolveRelation } from '../../core'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { Answer } from './Answer'
import { answerResolver } from './Answer'

/**
 * A specific question - e.g. from a user seeking answers online, or collected in a Frequently Asked Questions (FAQ) document.
 */
export interface QuestionLite extends Thing {
  /**
   * The text content of the question.
   */
  name: string
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  acceptedAnswer: NodeRelation<Answer | string>
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * Alias for `name`
   */
  question?: string
  /**
   * Alias for `acceptedAnswer`
   */
  answer?: string
}
export interface Question extends QuestionLite {}

/**
 * Describes a Question. Most commonly used in FAQPage or QAPage content.
 */
export const questionResolver = defineSchemaOrgResolver<Question>({
  defaults: {
    '@type': 'Question',
  },
  inheritMeta: [
    'inLanguage',
  ],
  resolve(question, ctx) {
    if (question.question)
      question.name = question.question
    if (question.answer)
      question.acceptedAnswer = question.answer
    // generate dynamic id if none has been set
    resolveId(question, ctx.meta.canonicalUrl)
    // resolve string answer to Answer
    question.acceptedAnswer = resolveRelation(question.acceptedAnswer, ctx, answerResolver)
    return question
  },
  rootNodeResolve(question, { findNode }) {
    const webPage = findNode<WebPage>(PrimaryWebPageId)

    // merge in nodes to the FAQPage
    if (webPage && asArray(webPage['@type']).includes('FAQPage'))
      dedupeMerge(webPage, 'mainEntity', idReference(question))
  },
})

export const defineQuestion = <T extends Question>(input?: T) => provideResolver(input, questionResolver)
