import { hasProtocol, joinURL, withBase } from 'ufo'
import type {
  Arrayable,
  Id,
  SchemaOrgNodeDefinition,
  Thing,
} from '../types'

export const idReference = <T extends Thing>(node: T | string) => ({
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

export const setIfEmpty = <T extends Thing>(node: T, field: keyof T, value: any) => {
  if (!node?.[field] && value)
    node[field] = value
}

export interface ResolverOptions {
  /**
   * Return single images as an object.
   */
  array?: boolean
  /**
   * Move added nodes to the root graph.
   */
  root?: boolean
  /**
   * Generates ids for nodes.
   */
  generateId?: boolean
  afterResolve?: (node: any) => void
}

export const asArray = (input: any) => Array.isArray(input) ? input : [input]

export const dedupeMerge = <T extends Thing>(node: T, field: keyof T, value: any) => {
  const dedupeMerge: any[] = []
  const input = asArray(node[field])
  dedupeMerge.push(...input)
  const data = new Set(dedupeMerge)
  data.add(value)
  // @ts-expect-error untyped key
  node[field] = [...data.values()]
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
    ...asArray(defaultType),
    ...asArray(val),
  ])
  return types.size === 1 ? val : [...types.values()]
}

export const resolveWithBaseUrl = (base: string, urlOrPath: string) => {
  // can't apply base if there's a protocol
  if (!urlOrPath || hasProtocol(urlOrPath) || (!urlOrPath.startsWith('/') && !urlOrPath.startsWith('#')))
    return urlOrPath
  return withBase(urlOrPath, base)
}

export const resolveUrl = <T extends Thing>(node: T, key: keyof T, prefix: string) => {
  if (node[key] && typeof node[key] === 'string')
    // @ts-expect-error untyped
    node[key] = resolveWithBaseUrl(prefix, node[key])
}

export const resolveId = (node: any, prefix: string) => {
  if (node['@id'])
    node['@id'] = resolveWithBaseUrl(prefix, node['@id']) as Id
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

export const provideResolver = <T>(input?: T, resolver?: SchemaOrgNodeDefinition<any>) => {
  if (!input) {
    // @ts-expect-error untyped
    input = {}
  }
  // @ts-expect-error untyped
  input._resolver = resolver
  return input
}
