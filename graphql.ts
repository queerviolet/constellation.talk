import {sleep} from './time'
import {graphql, buildSchema, isObjectType, isScalarType, isNonNullType, isListType, GraphQLObjectType, GraphQLField, GraphQLSchema} from 'graphql'
import {Graph} from './stage'
import {default as Atlas, Node} from './atlas'

function ofType(type: any) {
  while (isListType(type) || isNonNullType(type)) type = type.ofType;
  return type
}

function positionOf(id: string) {
  if (id === 'earthseed.Query') {
    return {fx: 0, fy: -300, fz: 0}
  }
  return {}
}

const nsId = (ns: string, type: Pick<GraphQLObjectType, "name">,
  field?: Pick<GraphQLField<any, any, any>, "name">) =>
  field
    ? `${ns}.${type.name}.${field.name}`
    : `${ns}.${type.name}`

function zero(schema: GraphQLSchema, type: GraphQLField<any, any, any>["type"]) {  
  if (isScalarType(type)) { return '0' }
  if (isListType(type)) return [zero(schema, type.ofType)]
  if (isNonNullType(type)) return zero(schema, type.ofType)
  if (isObjectType(type)) return (schema.getType(type.name) as any).resolvers
  console.error(type)
}

function resolver(field: Node, gqlSchema: GraphQLSchema, gqlField: GraphQLFieldExt) {
  return async () => {
    for (const input of field.linksIn) {
      Graph.highlight(input.sourceId)
      await sleep(200)
      Graph.highlight(input.id)
    }
    await sleep(200)
    Graph.highlight(field.id)
    for (const output of field.linksOut) {
      Graph.highlight(output.id)
      await sleep(200)
      Graph.highlight(output.targetId)
    }
    return zero(gqlSchema, gqlField.type)
  }
}

type GraphQLFieldExt = GraphQLField<any, any, any> & {
  also?: any[]
}

export function parseToGraph(graph: string, source: string | GraphQLSchema, atlas = Atlas) {
  const schema = typeof source === 'string' ? buildSchema(source) : source
  const types = schema.getTypeMap()
  
  for (const t in types) {
    const type = types[t]

    if (type.name.startsWith('_')) continue;
    if (isObjectType(type)) {
      // const typeId = nsId(ns, type)
      ;(type as any).resolvers = {}
      const isRoot = type.name === 'Query'
      const parentPath =
        isRoot
          ? { graph, owner: graph, type: type.name }
          :
        { graph, owner: type.extensions?.federation.serviceName ?? graph, type: type.name }
      const parentNode = atlas.type(parentPath)

      const fields = type.getFields()
      const typeFed = type.extensions?.federation
      const typeOwner = typeFed?.serviceName ?? graph
      for (const f in fields) {
        const field: GraphQLFieldExt = fields[f]
        
        // const fieldId = nsId(ns, type, field)
        // const args = field.args.length ? `(${field.args.map(a => a.name).join(', ')})` : ''
        // const fieldLabel = `${field.name}${args}`
        const returns = ofType(field.type)
        const returnsPath = { graph, owner: returns.extensions?.federation.serviceName ?? graph, type: returns.name }
        // atlas.type(returnsPath)

        const fieldNode = atlas.field(parentPath, field.name, field.args.map(a => a.name), returnsPath)
        ;(type as any).resolvers[field.name] = field.resolve = resolver(fieldNode, schema, field)
        
        const fieldFed = field.extensions?.federation
        if (fieldFed || typeFed) {
          const fieldOwner = fieldFed?.serviceName || typeOwner
          const upstreamNode = atlas.field({ graph: fieldOwner, owner: fieldOwner, type: type.name }, field.name, field.args.map(a => a.name), returnsPath)
          const origin = atlas.link(graph, fieldNode.id, upstreamNode.id, 'origin')
          console.log(fieldOwner, field.name, origin.id)
        }
      }
    }
  }
  return schema
}

import {composeServices} from '@apollo/federation'
import gql from 'graphql-tag'

Object.assign(window as any, {
  parseToGraph, graphql, composeServices, gql, Atlas
})
