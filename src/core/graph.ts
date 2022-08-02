import type { Arrayable, Id, RegisteredThing, Thing } from '../types'
import { asArray, resolveAsGraphKey, setIfEmpty } from '../utils'

export interface SchemaOrgContext {
  readonly nodes: RegisteredThing[]
  meta: Record<string, any>
  addNode: <T extends Arrayable<Thing>>(node: T) => void
  findNode: <T extends Thing>(id: Id | string) => T | null
  _ctxUid: number
}

export const createSchemaOrgGraph = (): SchemaOrgContext => {
  const nodes: RegisteredThing[] = []
  const meta = {}

  // used for deduping across duplicate context's
  let ctxUid = 0

  return {
    findNode<T extends Thing>(id: Id | string) {
      const key = resolveAsGraphKey(id) as Id
      return nodes
        .filter(n => !!n['@id'])
        .find(n => resolveAsGraphKey(n['@id'] as Id) === key) as unknown as T | null
    },
    addNode(input: Arrayable<Thing>) {
      asArray(input).forEach((node) => {
        const registeredNode = node as RegisteredThing
        setIfEmpty(registeredNode, '_uid', ctxUid++)
        nodes.push(registeredNode)
      })
    },
    _ctxUid: ctxUid,
    nodes,
    meta,
  }
}

export type SchemaOrgGraph = ReturnType<typeof createSchemaOrgGraph>

