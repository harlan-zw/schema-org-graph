import { describe, it, expect } from 'vitest'
import {createSchemaOrgGraph} from "../src/client";

describe('client', () => {

  it('has no nodes to start', () => {
    const graph = createSchemaOrgGraph()
    expect(graph.entries()).toMatchInlineSnapshot('[]')
  })

  it('generates empty schema', () => {
    const graph = createSchemaOrgGraph()
  })

})
