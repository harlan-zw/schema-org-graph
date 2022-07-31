import {createSchemaOrgGraph, graphToSchemaOrg} from "../src/core";
import {definePerson} from "../src/nodes/Person";

let graph

export function useSetup(fn) {
  graph = createSchemaOrgGraph()
  fn()
}

export function useSchemaOrg(args) {
  graph.addNode(args)
}

export function injectSchemaOrg() {
  const nodes = graph.nodes
  return {
    ...graph,
    graphNodes: graphToSchemaOrg(graph)['@graph']
  }
}
