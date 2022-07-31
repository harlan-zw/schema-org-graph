import { hasProtocol, joinURL, withBase } from 'ufo'
import { defu } from 'defu'
import type {
  Arrayable,
  Id,
  IdReference, SchemaOrgNodeDefinition,
  ResolvedRootNodeResolver,
  SchemaNode,
  OptionalAtKeys,
  SchemaOrgContext,
} from '../types'
import { resolveImages } from '../nodes/Image'
import {hash} from "ohash";

export const idReference = <T extends SchemaNode>(node: T | string) => ({
  '@id': typeof node !== 'string' ? node['@id'] : node,
})

export const resolveDateToIso = (val: Date | string) => {
  try {
    if (val instanceof Date)
      return val.toISOString()
    else
      return new Date(Date.parse(val)).toISOString()
  }
    // not too fussed if it can't be resolved, this is on the user to validate
  catch (e) {}
  return typeof val === 'string' ? val : val.toString()
}

export const IdentityId = '#identity'

export const setIfEmpty = <T extends SchemaNode | OptionalAtKeys<SchemaNode>>(node: T, field: keyof T, value: any) => {
  if (!node?.[field])
    node[field] = value
}

export const dedupeMerge = <T extends SchemaNode | OptionalAtKeys<SchemaNode>>(node: T, field: keyof T, value: any) => {
  /*
  const dedupeMerge: any[] = []
  if (Array.isArray(node[field]))
    // @ts-expect-error untyped key
    dedupeMerge.addNode(...node[field])
  else if (node[field])
    dedupeMerge.addNode(node[field])
  const data = new Set(dedupeMerge)
  data.add(value)
  // @ts-expect-error untyped key
  node[field] = [...data.values()]*/
}

type ResolverInput<T extends SchemaNode = SchemaNode> = OptionalAtKeys<T> | IdReference | string

export const isIdReference = (input: ResolverInput) =>
  typeof input !== 'string' && Object.keys(input).length === 1 && input['@id']

export interface ResolverOptions {
  /**
   * Return single images as an object
   */
  array?: boolean
}

export function resolveArrayable<
  Input extends OptionalAtKeys<any> | string = OptionalAtKeys<any>,
  Output extends Input = Input>(input: Arrayable<Input>,
                                fn: (node: Exclude<Input, IdReference>) => Input,
                                options: ResolverOptions = {},
):
  Arrayable<Output | IdReference> {
  const ids = (Array.isArray(input) ? input : [input]).map((a) => {
    // filter out id references
    if (isIdReference(a))
      return a as IdReference
    return fn(a as Exclude<Input, IdReference>)
  }) as Arrayable<Exclude<Input, string>>
  // avoid arrays for single entries
  if (!options.array && ids.length === 1)
    return ids[0]
  return ids
}

export const includesType = <T extends OptionalAtKeys<any>>(node: T, type: string) => {
  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
  return types.includes(type)
}

export const prefixId = (url: string, id: Id | string) => {
  // already prefixed
  if (hasProtocol(id))
    return url as Id
  if (!id.startsWith('#'))
    id = `#${id}`
  return joinURL(url, id) as Id
}

export const trimLength = (val: string, length: number) => {
  if (val.length > length) {
    const trimmedString = val.substring(0, length)
    return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')))
  }
  return val
}

export const resolveType = (val: Arrayable<string>, defaultType: Arrayable<string>) => {
  if (val === defaultType)
    return val
  const types = new Set<string>([
    ...(Array.isArray(defaultType) ? defaultType : [defaultType]),
    ...(Array.isArray(val) ? val : [val]),
  ])
  return types.size === 1 ? val : [...types.values()]
}

export const resolveWithBaseUrl = (base: string, urlOrPath: string) => {
  // can't apply base if there's a protocol
  if (!urlOrPath || hasProtocol(urlOrPath) || (!urlOrPath.startsWith('/') && !urlOrPath.startsWith('#')))
    return urlOrPath
  return withBase(urlOrPath, base)
}

export const resolveUrl = <T extends SchemaNode>(node: T, key: keyof T, prefix: string) => {
  if (node[key] && typeof node[key] === 'string')
    // @ts-expect-error untyped
    node[key] = resolveWithBaseUrl(prefix, node[key])
}

export const resolveId = <T extends OptionalAtKeys<any>>(node: T, prefix: string) => {
  if (node['@id'])
    node['@id'] = resolveWithBaseUrl(prefix, node['@id']) as Id
}

export const resolveNodesGraphKey = (node): Id => {
  const id = node['@id']
  if (!id) {
    return `#${hash(node)}` as Id
  }
  return resolveAsGraphKey(id)
}

export const resolveAsGraphKey = (key: string) => key.substring(key.lastIndexOf('#')) as Id

/**
 * Removes attributes which have a null or undefined value
 */
export const cleanAttributes = (obj: any) => {
  Object.keys(obj).forEach((k) => {
    // if (isRef(obj[k]))
    //   return
    if (obj[k] && typeof obj[k] === 'object') {
      cleanAttributes(obj[k])
      return
    }
    if (obj[k] === '' || obj[k] === null || typeof obj[k] === 'undefined')
      delete obj[k]
  })
  return obj
}

export const resolveFromMeta = <T extends OptionalAtKeys<any> = OptionalAtKeys<any>>(defaults: T, meta: Record<string, unknown>, keys: (keyof T)[]) => {
  if (typeof meta.title === 'string') {
    if (keys.includes('headline'))
      setIfEmpty(defaults, 'headline', meta.title)

    if (keys.includes('name'))
      setIfEmpty(defaults, 'name', meta.title)
  }
  if (typeof meta.description === 'string' && keys.includes('description'))
    setIfEmpty(defaults, 'description', meta.description)

  if (typeof meta.image === 'string' && keys.includes('image'))
    setIfEmpty(defaults, 'image', meta.image)

  if (keys.includes('dateModified') && (typeof meta.dateModified === 'string' || meta.dateModified instanceof Date))
    setIfEmpty(defaults, 'dateModified', meta.dateModified)

  if (keys.includes('datePublished') && (typeof meta.datePublished === 'string' || meta.datePublished instanceof Date))
    setIfEmpty(defaults, 'datePublished', meta.datePublished)
  // video
  if (keys.includes('uploadDate') && (typeof meta.datePublished === 'string' || meta.datePublished instanceof Date))
    setIfEmpty(defaults, 'uploadDate', meta.datePublished)
}

