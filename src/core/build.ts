import {Id, RegisteredThing, Thing} from "../types";
import {resolveAsGraphKey} from "../utils";
import {hash} from "ohash";
import {createSchemaOrgGraph} from "./graph";
import {imageResolver} from "../nodes/Image";
import {executeResolverOnNode, resolveNodeId, resolveRelation} from "./resolve";

export const buildSchemaOrgFromNodes = (nodes: RegisteredThing[]) => {
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


export const buildResolvedGraphCtx = (nodes: Thing[], meta: any) => {
  // create a new graph
  const ctx = createSchemaOrgGraph()
  ctx.meta = meta
  ctx.addNode(nodes)

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
