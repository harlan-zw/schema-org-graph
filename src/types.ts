import type { DeepPartial } from 'utility-types'
import type { SchemaOrgContext } from './core'
import type { Organization } from './nodes/Organization'
import type { Person } from './nodes/Person'
import type { Image } from './nodes/Image'

export type Arrayable<T> = T | Array<T>
export type NodeRelation<T> = T | IdReference
export type NodeRelations<T> = Arrayable<NodeRelation<T>>
export type Identity = Person | Organization
export type ResolvableDate = string | Date
export type OptionalSchemaOrgPrefix<T extends string> = T | `https://schema.org/${T}`

export interface ResolvedMeta {
  host: string
  url: string
  currency?: string
  inLanguage?: string
  image?: string
  title?: string
  description?: string
  datePublished?: string
  dateModified?: string
}

export interface MetaInput {
  host: string
  url?: string
  path?: string
  currency?: string
  image?: string
  inLanguage?: string
  title?: string
  description?: string
  datePublished?: string
  dateModified?: string
  /**
   * @deprecated use `language`
   */
  defaultLanguage?: string
  /**
   * @deprecated use `currency`
   */
  defaultCurrency?: string
  /**
   * @deprecated use `host`
   */
  canonicalHost?: string
  /**
   * @deprecated use `url` or `path`
   */
  canonicalUrl?: string
}

export interface SchemaOrgNodeDefinition<ResolvedInput> {
  alias?: string
  cast?: (node: any, ctx: SchemaOrgContext) => ResolvedInput
  idPrefix?: 'host' | 'url' | ['host' | 'url', string ]
  inheritMeta?: (keyof ResolvedMeta | { key: keyof ResolvedInput; meta: keyof ResolvedMeta })[]
  defaults?: DeepPartial<ResolvedInput> | ((ctx: SchemaOrgContext) => DeepPartial<any>)
  required?: (keyof ResolvedInput)[]
  resolve?: (node: ResolvedInput, ctx: SchemaOrgContext) => ResolvedInput
  rootNodeResolve?: (node: ResolvedInput, ctx: SchemaOrgContext) => void
}

export interface Thing {
  '@type'?: Arrayable<string>
  '@id'?: Id
  /**
   * A reference-by-ID to the WebPage node.
   */
  mainEntityOfPage?: Arrayable<IdReference>
  /**
   * A reference-by-ID to the WebPage node.
   */
  mainEntity?: Arrayable<IdReference>
  /**
   * An image object or referenced by ID.
   * - Must be at least 696 pixels wide.
   * - Must be of the following formats+file extensions: .jpg, .png, .gif ,or .webp.
   */
  image?: NodeRelations<Image | string>

  /**
   * Allow any arbitrary keys
   */
  [key: string]: any
}

export interface RegisteredThing extends Thing {
  _resolver?: any
  _uid: number
}

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}

export type Id = `#${string}` | `https://${string}#${string}`
