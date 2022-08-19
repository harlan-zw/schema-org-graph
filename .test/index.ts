import {buildResolvedGraphCtx, organiseNodes, createSchemaOrgGraph} from "../src/core";
import {resolveAsGraphKey} from "../src/utils";
import {Id, MetaInput} from "../src/types";

let graph
let ctxData: any = {}

export function useSetup(fn) {
  graph = createSchemaOrgGraph()
  fn()
}

export function mockRoute(data: Omit<MetaInput, 'host'>, fn: () => void) {
  ctxData = data
  fn()
  ctxData = {}
}

export function useSchemaOrg(args) {
  graph.addNode(args)
}

export function injectSchemaOrg() {
  const resolvedCtx = buildResolvedGraphCtx(graph.nodes, {
    inLanguage: 'en-AU',
    host: 'https://example.com/',
    currency: 'AUD',
    path: '/',
    ...ctxData
  })
  const graphNodes = organiseNodes(resolvedCtx.nodes)
  resolvedCtx.findNode = (id) => {
    const key = resolveAsGraphKey(id) as Id
    return graphNodes
      .filter(n => !!n['@id'])
      .find(n => resolveAsGraphKey(n['@id'] as Id) === key)
  }
  resolvedCtx.graphNodes = graphNodes
  return resolvedCtx
}
