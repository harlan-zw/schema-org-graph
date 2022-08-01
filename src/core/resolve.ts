import { hash } from 'ohash'
import { defu } from 'defu'
import type {
  Arrayable,
  SchemaOrgNodeDefinition,
  Thing,
} from '../types'
import type { ResolverOptions } from '../utils'
import { asArray, idReference, prefixId, setIfEmpty } from '../utils'
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
    node = defu(node, defaults)
  }

  // handle meta inherits
  resolver.inheritMeta?.forEach((key) => {
    if (typeof key === 'string') { setIfEmpty(node, key, ctx.meta?.[key]) }
    else {
      // @ts-expect-error untyped
      setIfEmpty(node, key.key, ctx.meta?.[key.meta])
    }
  })

  // handle resolve
  if (resolver?.resolve)
    node = resolver.resolve(node, ctx)

  return node
}

export const resolveNodeId = <T extends Thing>(node: T, ctx: SchemaOrgContext, resolver: SchemaOrgNodeDefinition<T>) => {
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
    node['@id'] = prefixId(resolver.root ? ctx.meta.canonicalHost : ctx.meta.canonicalUrl, `#/schema/${alias}/${hash(hashNodeData)}`)
  }
  return node
}

export function resolveRelation(input: Arrayable<any>, ctx: any,
  resolver: SchemaOrgNodeDefinition<any>,
  options: ResolverOptions = {},
) {
  if (!input)
    return input

  const ids = asArray(input).map((a) => {
    // filter out id references
    if (Object.keys(input).length === 1 && input['@id'])
      return a

    let node = executeResolverOnNode(a, ctx, resolver)
    if (options.afterResolve)
      options.afterResolve(node)

    // root nodes need ids
    if (options.generateId || options.root)
      node = resolveNodeId(node, ctx, resolver)

    if (options.root) {
      if (resolver.rootNodeResolve)
        resolver.rootNodeResolve(node, ctx)
      ctx.addNode(node, ctx)
      return idReference(node['@id'])
    }

    return node
  })

  // avoid arrays for single entries
  if (!options.array && ids.length === 1)
    return ids[0]

  return ids
}
