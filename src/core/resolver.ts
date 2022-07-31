import {
  Id,
  SchemaOrgNodeDefinition,
  SchemaNode,
  SchemaOrgContext
} from "../types";
import {resolveImages} from "../nodes/Image";
import { prefixId, resolveAsGraphKey} from "../utils";
import {hash} from "ohash";
import {SchemaOrgGraph} from "./graph";
import {defu} from "defu";

export const graphToSchemaOrg = (graph: SchemaOrgGraph) => {
  const keys = graph.nodes
    .sort((a, b) => parseInt(a._uid) - parseInt(b._uid))
    .keys()

  // assign based on id to dedupe across context
  const dedupedNodes: Record<Id, SchemaNode> = {}
  for (const key of keys) {
    const n = graph.nodes[key]
    const nodeKey = resolveAsGraphKey(n['@id'] || hash(n))
    dedupedNodes[nodeKey] = Object.keys(n).sort().reduce(
      (obj, key) => {
        obj[key] = n[key];
        return obj;
      },
      {}
    )
    // delete meta fields
    delete dedupedNodes[nodeKey]._uid
    delete dedupedNodes[nodeKey]._resolver
  }
  return {
    '@context': 'https://schema.org',
    '@graph': Object.values(dedupedNodes),
  }
}

export const resolveGraphNodes = (graph: SchemaOrgGraph) => {
  const ctx = graph as SchemaOrgContext
  ctx.canonicalHost = 'https://example.com'
  ctx.options = {
    defaultLanguage: 'en'
  }
  ctx.meta = {

  }

  graph.nodes
    .sort((a, b) => parseInt(a._uid) - parseInt(b._uid))
    .forEach((node, key) => {
      // handle images for all nodes
      if (node.image) {
        node.image = resolveImages(ctx, node.image, {
          resolvePrimaryImage: true,
          asRootNodes: true,
        })
      }

      // handle defaults
      if (node._resolver?.defaults) {
        // handle defaults
        let defaults = node._resolver.defaults || {}
        if (typeof defaults === 'function')
          defaults = defaults(ctx)
        node = defu(node, defaults)
      }
      // handle resolve
      if (node._resolver?.resolve) {
        node = node._resolver.resolve(node, ctx)
      }
      if (!node['@id'])
        node['@id'] = prefixId(ctx.canonicalHost, `#${hash(node)}`)
      graph.nodes[key] = node
    })

  graph.nodes.forEach((node) => {
    if (node._resolver?.rootNodeResolve)
      node._resolver.rootNodeResolve(node, ctx)
  })
}

export function defineSchemaOrgNode<T extends SchemaNode>(schema: SchemaOrgNodeDefinition<T>): SchemaOrgNodeDefinition<T> {
  return schema
}
