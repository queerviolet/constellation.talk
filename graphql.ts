import {parse, buildSchema, isObjectType, isScalarType, isNonNullType, isListType, GraphQLObjectType} from 'graphql'

function ofType(type: any) {
  while (isListType(type) || isNonNullType(type)) type = type.ofType;
  return type
}

function positionOf(type: GraphQLObjectType) {
  if (type.name === 'Query') {
    return {fx: 10, fy: 0, fz: 0}
  }
}

export function parseToGraph(source: string) {
  const schema = buildSchema(source)  
  const types = schema.getTypeMap()
  const links = []
  const nodes = []
  for (const t in types) {
    const type = types[t]
    ;(type as any).id = type.name

    if (type.name.startsWith('_')) continue;    
    if (isObjectType(type)) {
      nodes.push({
        id: type.name, name: type.name, isType: true,          
        ...positionOf(type),
      })
      let fields = type.getFields()
      for (const f in fields) {
        let field = fields[f]

        let fieldId = `${type.name}.${field.name}: ${field.type.inspect()}`
        let fieldLabel = `${type.name}.${field.name}: ${field.type.inspect()}`
        let finalType = ofType(field.type)

        nodes.push({
          id: fieldId,
          name: fieldLabel,
          isField: true,
          isScalar: isScalarType(finalType),
          isEntryPoint: type.name === 'Query'
        })
        links.push({
          source: type.name,
          target: fieldId,
          curve: isObjectType(finalType) ? Math.random() - 0.5 : 0,
        })

        if (isObjectType(finalType)) {
          links.push({
            source: fieldId,
            target: finalType.name,
            curve: Math.random() - 0.5,
          })
        }

        // const target = isScalarType(finalType)
        //   ? `${type.name}.${field.name}<${field.type.inspect()}>`
        //   : finalType.inspect()

        // links.push({
        //   source: type.name,
        //   target,
        //   name: field.name //`${field.name}(${Object.entries(field.args).join(', ')})`
        // })
        // if (/[\[!<]+/.test(target)) {
        //   nodes.push({
        //     id: target,
        //     isScalarColumn: true,
        //     name: field.type.inspect(),
        //   })
        // }
      }
    }
  }
  const data = {nodes, links}
  console.log(data)
  return data
}

const w = window as any;
w.parseToGraph = parseToGraph;