import {Arrayable, Id, SchemaNode, OptionalAtKeys} from "../types";
import {resolveAsGraphKey} from "../utils";

export const createSchemaOrgGraph = () => {
  let nodes: OptionalAtKeys<SchemaNode>[] = []

  // used for deduping across duplicate context's
  let ctxUid = 0

  return {
    findNode<T extends SchemaNode>(id: Id|string) {
      const key = resolveAsGraphKey(id) as Id
      return nodes
        .filter(n => !!n['@id'])
        .find(n => resolveAsGraphKey(n['@id'] as Id) === key) as unknown as T | null
    },
    addNode(input: Arrayable<OptionalAtKeys<SchemaNode>>) {
      (Array.isArray(input) ? input : [input]).forEach((node) => {
        node._uid = ctxUid
        nodes.push(node)
      })
    },
    clearUid(uid) {
      nodes = nodes.filter(n => n._uid !== uid)
    },
    uid: ctxUid,
    nodes,
  }
}

export type SchemaOrgGraph = ReturnType<typeof createSchemaOrgGraph>

