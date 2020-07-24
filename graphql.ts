import {sleep} from './time'
import {graphql, buildSchema, isObjectType, isScalarType, isNonNullType, isListType, GraphQLObjectType, GraphQLField, GraphQLSchema} from 'graphql'
import {Graph, Atlas} from './stage'

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

function resolver(ns: string, schema: GraphQLSchema, type: GraphQLObjectType, field: GraphQLFieldExt) {
  const id = nsId(ns, type, field)
  const to = nsId(ns, ofType(field.type))
  return async (...args) => {
    console.log(id, to)
    Graph.highlight(nsId(ns, type))
    Graph.highlight(id + ':in')
    Graph.highlight(id)
    if (field.also) {
      for (const {id} of field.also) {
        Graph.highlight(id)
      }
    }
    await sleep(1000)
    Graph.highlight(id + ':out')
    Graph.highlight(to)
    const result = zero(schema, field.type)
    console.log('result=', result)
    return result
  }
}

type GraphQLFieldExt = GraphQLField<any, any, any> & {
  also?: any[]
}

export function parseToGraph(ns: string, source: string | GraphQLSchema) {
  const schema = typeof source === 'string' ? buildSchema(source) : source
  const types = schema.getTypeMap()
  const links = []
  const nodes = []

  function addNode(node: any) {
    const existing = Atlas[node.id]
    if (existing) {
      Object.assign(existing, node)
      nodes.push(existing)
      return existing
    }
    
    Atlas[node.id] = node
    nodes.push(node)
    return node
  }

  function addLink(link: any) {
    const existing = Atlas[link.id]
    if (existing) {
      Object.assign(existing, link)
      links.push(existing)
      return existing
    }
    
    Atlas[link.id] = link
    links.push(link)
    return link
  }

  for (const t in types) {
    const type = types[t]
    ;(type as any).id = type.name

    if (type.name.startsWith('_')) continue;
    if (isObjectType(type)) {
      const typeId = nsId(ns, type)
      ;(type as any).resolvers = {}
      addNode({
        graph: ns,
        id: typeId,
        name: type.name === 'Query' ? ns + '.Query' : type.name,
        isType: true,
        isRoot: type.name === 'Query',
        ...positionOf(typeId),
      })
      const typeOwnerNs = type.extensions?.federation.serviceName

      let fields = type.getFields()
      for (const f in fields) {
        let field: GraphQLFieldExt = fields[f]
        ;(type as any).resolvers[field.name] = field.resolve = resolver(ns, schema, type, field)
        let fieldId = nsId(ns, type, field)
        const args = field.args.length ? `(${field.args.map(a => a.name).join(', ')})` : ''
        let fieldLabel = `${field.name}${args}`
        let finalType = ofType(field.type)

        addNode({
          graph: ns,
          id: fieldId,
          name: fieldLabel,
          isField: true,
          isScalar: isScalarType(finalType),
          isEntryPoint: type.name === 'Query'
        })

        addLink({
          id: fieldId + ':in',
          graph: ns,
          source: typeId,
          target: fieldId,
          curve: isObjectType(finalType) ? Math.random() - 0.5 : 0,
        })

        const {federation} = field.extensions || type.extensions || {}
        if (federation) {
          field.also = field.also || []
          let otherNs = federation.serviceName
          let fedId = nsId(otherNs, type, field)
          const extTypeId = nsId(otherNs, type)

          if (otherNs !== typeOwnerNs) {
            // This field is declared in an extension
            const extEntitiesId = nsId(otherNs, {name: 'Query'}, {name: '__entities'})
            const extQueryId = nsId(otherNs, {name: 'Query'})
            const typeByEntitiesId = extEntitiesId + ':' + extTypeId
            field.also.push(
              addNode({
                graph: otherNs,
                id: extTypeId,
                name: type.name === 'Query' ? otherNs + '.Query' : type.name,
                isType: true,
                isRoot: type.name === 'Query',
              }),
              addNode({
                graph: otherNs,
                id: extEntitiesId,
                name: '__entities',
                isField: true,
              }),
              addLink({
                graph: otherNs,
                id: extEntitiesId + ':in',
                source: extQueryId,
                target: extEntitiesId,              
              }),
              addLink({
                graph: otherNs,
                id: typeByEntitiesId,
                source: extEntitiesId,
                target: extTypeId,
              }),
              addLink({
                graph: otherNs,
                id: fedId + ':in',
                source: extTypeId,
                target: fedId,
              })
            )
          }

          field.also.push(
            addNode({
              graph: otherNs,
              id: fedId,
              name: fieldLabel,
              isField: true,
              isScalar: isScalarType(finalType),              
            }),          
            addLink({
              id: fieldId + ":fed",
              graph: ns,
              source: fieldId,
              target: fedId,
            })
          )
        }

        if (isObjectType(finalType)) {
          addLink({
            id: fieldId + ':out',
            graph: ns,
            source: fieldId,
            target: nsId(ns, finalType),
            curve: Math.random() - 0.5,
          })
        }
      }
    }
  }
  const data = {nodes, links, schema}
  console.log(data)
  return data
}

import {composeServices} from '@apollo/federation'
import gql from 'graphql-tag'

Object.assign(window as any, {
  parseToGraph, graphql, composeServices, gql
})
