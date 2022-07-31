import type { DeepPartial, Optional } from 'utility-types'
import type { ImageInput } from './nodes/Image'

export type Arrayable<T> = T | Array<T>

export type OptionalAtKeys<T extends SchemaNode | IdReference, OptionalKeys extends keyof T = undefined> = Optional<T, OptionalKeys | DefaultOptionalKeys>

export type IdGraph = Record<Id, SchemaNode>

export type ResolvableDate = string | Date

export type DefaultOptionalKeys = '@id' | '@type'

export interface SchemaOrgNodeDefinition<ResolvedInput> {
  defaults?: DeepPartial<ResolvedInput> | ((ctx: SchemaOrgContext) => DeepPartial<ResolvedInput>)
  required?: (keyof ResolvedInput)[]
  resolve?: (node: ResolvedInput, ctx: SchemaOrgContext) => ResolvedInput
  rootNodeResolve?: (node: ResolvedInput, ctx: SchemaOrgContext) => void
}

export interface Thing {
  '@type': Arrayable<string>
  '@id': Id
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
  image?: Arrayable<ImageInput>

  _resolver?: any
  _uid?: number
}

export type SchemaNode = Thing

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}

export type MaybeIdReference<T> = T | IdReference

export type Id = `#${string}` | `https://${string}#${string}`

export interface SchemaOrgContext {
  canonicalHost: string
  canonicalUrl: string
  uid: number
  meta: Record<string, any>
  // client helpers
  addNode: <T extends SchemaNode>(node: T, ctx: SchemaOrgContext) => Id
  findNode: <T extends SchemaNode>(id: Id) => T | null
}

export interface SchemaOrgOptions {
  /**
   * The production URL of your site. This allows the client to generate all URLs for you and is important to set correctly.
   */
  canonicalHost?: string
  /**
   * Will set the `isLanguage` to this value for any Schema which uses it. Should be a valid language code, i.e `en-AU`
   */
  defaultLanguage?: string
  /**
   * Will set the `priceCurrency` for [Product](/schema/product) Offer Schema. Should be a valid currency code, i.e `AUD`
   */
  defaultCurrency?: string
  /**
   * Will enable debug logs to be shown.
   */
  debug?: boolean
}
