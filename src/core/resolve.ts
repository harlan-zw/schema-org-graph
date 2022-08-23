import { hash } from 'ohash'
import { defu } from 'defu'
import type {
  Arrayable,
  SchemaOrgNodeDefinition,
  Thing,
} from '../types'
import type { ResolverOptions } from '../utils'
import { asArray, idReference, prefixId, setIfEmpty, stripEmptyProperties } from '../utils'
import type { SchemaOrgContext } from './graph'

export const executeResolverOnNode = <T extends Thing>(node: T, ctx: SchemaOrgContext, resolver: SchemaOrgNodeDefinition<T>) => {
  // allow casting from a primitive to an object
  if (resolver?.cast)
    node = resolver.cast(node, ctx)

  // handle defaults
  if (resolver?.defaults) {
    // handle defaults
    let defaults = resolver.defaults || {}
    if (typeof defaults === 'function')
      defaults = defaults(ctx)
    node = defu(node, defaults) as T
  }

  // handle meta inherits
  resolver.inheritMeta?.forEach((entry) => {
    if (typeof entry === 'string')
      setIfEmpty(node, entry, ctx.meta[entry])
    else
      setIfEmpty(node, entry.key, ctx.meta[entry.meta])
  })

  // handle resolve
  if (resolver?.resolve)
    node = resolver.resolve(node, ctx)

  stripEmptyProperties(node)
  return node
}

export const resolveNodeId = <T extends Thing>(node: T, ctx: SchemaOrgContext, resolver: SchemaOrgNodeDefinition<T>, resolveAsRoot = false) => {
  const prefix = Array.isArray(resolver.idPrefix) ? resolver.idPrefix[0] : resolver.idPrefix

  // may not need an @id
  if (!prefix)
    return node

  // transform #my-id into https://host.com/#my-id
  if (node['@id'] && !(node['@id'] as string).startsWith(ctx.meta.host)) {
    node['@id'] = prefixId(ctx.meta[prefix], node['@id'])
    return node
  }

  const rootId = Array.isArray(resolver.idPrefix) ? resolver.idPrefix?.[1] : undefined
  // transform ['host', PrimaryWebPageId] to https://host.com/#webpage
  if (resolveAsRoot && rootId) {
    // allow overriding root ids
    node['@id'] = prefixId(ctx.meta[prefix], rootId)
  }
  // transform 'host' to https://host.com/#schema/webpage/gj5g59gg
  if (!node['@id']) {
    let alias = resolver?.alias
    if (!alias) {
      const type = asArray(node['@type'])?.[0] || ''
      alias = type.toLowerCase()
    }
    const hashNodeData: Record<string, any> = {}
    Object.entries(node).forEach(([key, val]) => {
      // remove runtime private fields
      if (!key.startsWith('_'))
        hashNodeData[key] = val
    })
    node['@id'] = prefixId(ctx.meta[prefix], `#/schema/${alias}/${hash(hashNodeData)}`)
  }
  return node
}

export function resolveRelation(input: Arrayable<any>, ctx: SchemaOrgContext,
  fallbackResolver?: SchemaOrgNodeDefinition<any>,
  options: ResolverOptions = {},
) {
  if (!input)
    return input

  const ids = asArray(input).map((a) => {
    // filter out id references
    if (Object.keys(a).length === 1 && a['@id'])
      return a

    let resolver = fallbackResolver
    // remove resolver if the user is using define functions nested
    if (a._resolver) {
      resolver = a._resolver
      delete a._resolver
    }

    // no resolver, resolve as is
    if (!resolver)
      return a

    let node = executeResolverOnNode(a, ctx, resolver)
    if (options.afterResolve)
      options.afterResolve(node)

    // root nodes need ids
    if (options.generateId || options.root)
      node = resolveNodeId(node, ctx, resolver, false)

    if (options.root) {
      if (resolver.rootNodeResolve)
        resolver.rootNodeResolve(node, ctx)
      ctx.addNode(node)
      return idReference(node['@id'])
    }

    return node
  })

  // avoid arrays for single entries
  if (!options.array && ids.length === 1)
    return ids[0]

  return ids
}
