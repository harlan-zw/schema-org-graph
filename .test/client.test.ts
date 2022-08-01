import { describe, it, expect } from 'vitest'
import {createSchemaOrgGraph} from "../src";

describe('client', () => {

  it('has no nodes to start', () => {
    const graph = createSchemaOrgGraph()
    expect(graph.entries()).toMatchInlineSnapshot('[]')
  })

})
