import { hash } from 'ohash'
import { joinURL } from 'ufo'
import type { Id, MetaInput, RegisteredThing, ResolvedMeta, Thing } from '../types'
import { resolveAsGraphKey } from '../utils'
import { imageResolver } from '../nodes/Image'
import type { SchemaOrgContext } from './graph'
import { createSchemaOrgGraph } from './graph'
import { executeResolverOnNode, resolveNodeId, resolveRelation } from './resolve'

export const renderNodesToSchemaOrgJson = (nodes: RegisteredThing[]) => {
  return {
    '@context': 'https://schema.org',
    '@graph': Object.values(nodes),
  }
}

export const renderNodesToSchemaOrgHtml = (nodes: RegisteredThing[], options = { spaces: 2 }) => {
  return JSON.stringify(renderNodesToSchemaOrgJson(nodes), undefined, options.spaces)
}

export const dedupeAndFlattenNodes = (nodes: RegisteredThing[]) => {
  const keys = nodes
    .sort((a, b) => a._uid - b._uid)
    .keys()

  // assign based on id to dedupe across context
  const dedupedNodes: Record<Id, RegisteredThing> = {}
  for (const key of keys) {
    const n = nodes[key]
    const nodeKey = resolveAsGraphKey(n['@id'] || hash(n))
    dedupedNodes[nodeKey] = Object.keys(n)
      .sort()
      .reduce(
        (obj: any, key) => {
          obj[key] = n[key]
          return obj
        },
        {},
      )
    // node priority is resolved, no longer need
    // @ts-expect-error untyped
    delete dedupedNodes[nodeKey]._uid
  }
  return Object.values(dedupedNodes)
}

export const resolveMeta = (meta: MetaInput) => {
  if (!meta.host && meta.canonicalHost)
    meta.host = meta.canonicalHost
  if (!meta.host && typeof document !== 'undefined')
    meta.host = document.location.host

  if (!meta.url && meta.canonicalUrl)
    meta.url = meta.canonicalUrl

  if (!meta.url && meta.path)
    meta.url = joinURL(meta.host, meta.path)

  if (!meta.inLanguage && meta.defaultLanguage)
    meta.inLanguage = meta.defaultLanguage

  return <ResolvedMeta> {
    host: meta.host,
    url: meta.url,
    currency: meta.currency,
    image: meta.image,
    inLanguage: meta.inLanguage,
    title: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
  }
}

export const buildResolvedGraphCtx = (nodes: Thing[], meta: MetaInput) => {
  // create a new graph
  const ctx = createSchemaOrgGraph()
  ctx.meta = resolveMeta(meta)

  ctx.addNode(nodes)

  ctx.nodes
    .sort((a, b) => a._uid - b._uid)
    .forEach((node, key) => {
      const resolver = node._resolver
      if (resolver) {
        node = executeResolverOnNode(node, ctx, resolver)
        node = resolveNodeId(node, ctx, resolver)
      }
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

      // node is resolved, no longer need resolver
      delete node._resolver
    })

  return ctx
}

export const renderCtxToSchemaOrgJson = (ctx: SchemaOrgContext, meta: MetaInput) => {
  const resolvedCtx = buildResolvedGraphCtx(ctx.nodes, meta)
  const graphNodes = dedupeAndFlattenNodes(resolvedCtx.nodes)
  return renderNodesToSchemaOrgJson(graphNodes)
}
