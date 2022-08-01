import type { DeepPartial } from 'utility-types'
import type { ImageInput } from './nodes/Image'
import type { SchemaOrgContext } from './core'

export type Arrayable<T> = T | Array<T>

export type ResolvableDate = string | Date

export type DefaultOptionalKeys = '@type'

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
  image?: Arrayable<ImageInput>
}

export interface RegisteredThing extends Thing {
  _resolver?: any
  _uid: number
}

export interface IdReference {
  /** IRI identifying the canonical address of this object. */
  '@id': string
}

export type MaybeIdReference<T> = T | IdReference

export type Id = `#${string}` | `https://${string}#${string}`
