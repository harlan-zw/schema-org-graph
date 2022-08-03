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

export interface SchemaOrgNodeDefinition<ResolvedInput> {
  alias?: string
  root?: boolean
  cast?: (node: any, ctx: SchemaOrgContext) => ResolvedInput
  inheritMeta?: (keyof ResolvedInput | { key: keyof ResolvedInput; meta: string })[]
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
