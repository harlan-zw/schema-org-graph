import {buildResolvedGraphCtx, buildSchemaOrgFromNodes, createSchemaOrgGraph} from "../src/core";
import {resolveAsGraphKey} from "../src/utils";
import {Id} from "../src/types";
import {joinURL} from "ufo";

const defaultData = {
  inLanguage: 'en-AU',
  canonicalHost: 'https://example.com/',
  canonicalUrl: 'https://example.com/',
}
let graph
let ctxData: any = defaultData

export function useSetup(fn) {
  graph = createSchemaOrgGraph()
  fn()
}

export function mockRoute(data: any, fn: () => void) {
  ctxData = {
    ...ctxData,
    ...data
  }
  if (ctxData.url) {
    ctxData.canonicalUrl = ctxData.url
  }
  if (ctxData.path) {
    ctxData.canonicalUrl = joinURL(ctxData.canonicalHost, ctxData.path)
  }
  if (!ctxData.canonicalUrl) {
    ctxData.canonicalUrl = ctxData.canonicalHost
  }
  fn()
  ctxData = defaultData
}

export function useSchemaOrg(args) {
  graph.addNode(args)
}

export function injectSchemaOrg() {
  const resolvedCtx = buildResolvedGraphCtx(graph.nodes, ctxData)
  const graphNodes = buildSchemaOrgFromNodes(resolvedCtx.nodes)['@graph']
  resolvedCtx.findNode = (id) => {
    const key = resolveAsGraphKey(id) as Id
    return graphNodes
      .filter(n => !!n['@id'])
      .find(n => resolveAsGraphKey(n['@id'] as Id) === key)
  }
  resolvedCtx.graphNodes = graphNodes
  return resolvedCtx
}
