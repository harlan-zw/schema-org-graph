import { hash } from 'ohash'
import { defu } from 'defu'
import type {
  Arrayable,
  Id,
  RegisteredThing, SchemaOrgNodeDefinition,
  Thing,
} from '../types'
import { imageResolver } from '../nodes/Image'
import type { ResolverOptions } from '../utils'
import { asArray, idReference, prefixId, resolveAsGraphKey, setIfEmpty } from '../utils'
import type { SchemaOrgContext, SchemaOrgGraph } from './graph'
import { createSchemaOrgGraph } from './graph'

export const graphToSchemaOrg = (graph: SchemaOrgGraph) => {
  const keys = graph.nodes
    .sort((a, b) => a._uid - b._uid)
    .keys()

  // assign based on id to dedupe across context
  const dedupedNodes: Record<Id, RegisteredThing> = {}
  for (const key of keys) {
    const n = graph.nodes[key]
    const nodeKey = resolveAsGraphKey(n['@id'] || hash(n))
    dedupedNodes[nodeKey] = Object.keys(n)
      .sort()
      .reduce(
        (obj: any, key) => {
          // @ts-expect-error untyped
          obj[key] = n[key]
          return obj
        },
        {},
      )
    // delete meta fields
    // @ts-expect-error untyped
    delete dedupedNodes[nodeKey]._uid
    delete dedupedNodes[nodeKey]._resolver
  }
  return {
    '@context': 'https://schema.org',
    '@graph': Object.values(dedupedNodes),
  }
}

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
    if (typeof key === 'string') { setIfEmpty(node, key, ctx.meta[key]) }
    else {
      // @ts-expect-error untyped
      setIfEmpty(node, key.key, ctx.meta[key.meta])
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
    node['@id'] = prefixId(resolver.root ? ctx.meta.canonicalHost : ctx.meta.canonicalUrl, `#/schema/${alias}/${hash(node)}`)
  }
  return node
}

export const resolveGraphNodes = (graph: Readonly<SchemaOrgGraph>, meta: any) => {
  // create a new graph
  const ctx = createSchemaOrgGraph()
  ctx.meta = meta
  ctx.addNode(graph.nodes)

  ctx.nodes
    .sort((a, b) => a._uid - b._uid)
    .forEach((node, key) => {
      const resolver = node._resolver
      node = executeResolverOnNode(node, ctx, resolver)
      node = resolveNodeId(node, ctx, resolver)
      ctx.nodes[key] = node
    })

  ctx.nodes
    .sort((a, b) => a._uid - b._uid)
    .forEach((node) => {
      // handle images for all nodes
      if (node.image && typeof node.image === 'string') {
        node.image = resolveRelation(node.image, ctx, imageResolver, {
          root: true,
        })
      }
      if (node._resolver?.rootNodeResolve)
        node._resolver.rootNodeResolve(node, ctx)
    })

  return ctx
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
