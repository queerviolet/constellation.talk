
// Atlas: {
//   [id: string]: {
//     node?: any
//     link?: any
//     three?: THREE.Object3D
//     sprite?: SpriteTextExt
//   }
// } = {}

export class Entity {
  constructor(public readonly graph: string, public readonly id: string, public readonly label?: string) {}
}

export class Link extends Entity {
  static id(graph: string, source: string, target: string, rel: string) {
    return `(${source})-[${rel}]->(${target})`
  }

  constructor(
    public readonly graph: string,
    public readonly sourceId: string,
    public readonly targetId: string,
    public readonly rel: string = '') {
      super(graph, Link.id(graph, sourceId, targetId, rel))
      this.source = sourceId
      this.target = targetId
  }

  public source: any
  public target: any

  public sourceNode: Node
  public targetNode: Node
}

enum Kind {
  RootType, ObjectType, ExtType, ScalarField, ObjectField
}

interface Type {
  graph: string
  owner: string
  type: string
}

const SCALAR_TYPES = {
  ID: true,
  String: true,
  Int: true,
  Float: true,
  Date: true,
  Boolean: true
}

function isScalar({type}: Type) {
  return type in SCALAR_TYPES
}

export class Node extends Entity {
  static forType({ graph, owner, type }: Type) {
    return new Node(
      graph,
      this.id({ graph, owner, type }),
      type in Node.ROOT_TYPES
        ? Kind.RootType
        :
      owner !== graph
        ? Kind.ExtType
        :
        Kind.ObjectType,
      this.labelForType({ graph, owner, type })
    )
  }

  static forField(parent: Type, field: string, args: string[], returns: Type) {
    return new Node(
      parent.graph,
      this.id(parent, field),
      isScalar(returns) ? Kind.ScalarField : Kind.ObjectField,
      this.labelForField(field, args))
  }

  static ROOT_TYPES = { Query: true, Mutation: true, Subscription: true }

  static id({ graph, owner, type }: Type, field?: string) {
    return `${graph}::${owner}.${type}${field ? '.' + field : ''}`
  }

  static labelForType(type: Type) {
    const {graph, owner} = type
    return (
      type.type in Node.ROOT_TYPES || owner !== graph
        ? `${owner}::${type.type}`
        :
        type.type
    )
  }

  static labelForField(name: string, args?: string[]) {
    return args?.length ? `${name}(${args.join(', ')})` : name
  }


  constructor(graph: string, id: string, public readonly kind: Kind, name: string) {
    super(graph, id, name)
  }

  get isType() { return this.kind === Kind.RootType || this.kind === Kind.ObjectType || this.kind === Kind.ExtType }
  get isField() { return this.kind === Kind.ScalarField || this.kind === Kind.ObjectField }
  get isRoot() { return this.kind === Kind.RootType }

  linksIn = new Set<Link>()
  linksOut = new Set<Link>()
}

interface Graph {
  nodes: Node[]
  links: Link[]
}

export class Atlas {
  type(type: Type) {
    const {nodes} = this
    const id = Node.id(type)
    const existing = nodes.get(id)
    if (existing) return existing
    const created = Node.forType(type)
    this.addNode(created)
    this.graph(type.graph).nodes.push(created)
    return created
  }

  field(parent: Type, field: string, args: string[], returns: Type) {
    const {nodes} = this
    const id = Node.id(parent, field)
    const existing = nodes.get(id)
    if (existing) return existing

    const created = Node.forField(parent, field, args, returns)
    this.addNode(created)
    this.graph(parent.graph).nodes.push(created)
    
    const parentId = this.type(parent).id
    this.link(parent.graph, parentId, created.id, 'field')
    
    if (!isScalar(returns)) {
      const returnsId = this.type(returns).id
      this.link(parent.graph, created.id, returnsId, 'returns')
    }

    return created
  }

  link(graph: string, source: string, target: string, rel = '') {
    const id = Link.id(graph, source, target, rel)
    const {links} = this
    const existing = links.get(id)
    if (existing) return existing
    const created = new Link(graph, source, target, rel)
    links.set(id, created)
    this.graph(graph).links.push(created)
    this.wireUp(created)
    return created
  }

  graph(graph: string) {
    const {graphs} = this
    const existing = graphs.get(graph)
    if (existing) return existing
    const created = { nodes: [], links: [] }
    graphs.set(graph, created)
    return created
  }

  graphData(...ids: string[]) {
    if (!ids.length) ids = [...this.graphs.keys()]
    let data = { nodes: [], links: [] }
    for (const graphId of ids) {
      const graph = this.graph(graphId)
      data.nodes = data.nodes.concat(graph.nodes)
      data.links = data.links.concat(graph.links.filter(l => l.sourceNode && l.targetNode))
    }
    const nodeIds = new Set(data.nodes.map(n => n.id))
    console.log('ids', ids, nodeIds)
    data.links = data.links.filter(l => nodeIds.has(l.sourceId) && nodeIds.has(l.targetId))
    return data
  }

  nodes = new Map<string, Node>()
  links = new Map<string, Link>()
  graphs = new Map<string, Graph>()

  private wireUp(link: Link) {
    const {links, nodes} = this
    const src = nodes.get(link.sourceId)
    const dst = nodes.get(link.targetId)
    if (!src)
      this.deferLink(link.sourceId, link)
    else {
      link.sourceNode = src
      src.linksOut.add(link)
    }
    if (!dst)
      this.deferLink(link.targetId, link)
    else {
      link.targetNode = dst
      dst.linksIn.add(link)
    }
  }

  private addNode(node: Node) {
    const {id} = node
    this.nodes.set(id, node)
    const deferred = this.deferredLinks.get(id)
    if (deferred) {
      for (const link of deferred) {
        if (link.sourceId === id) {
          node.linksOut.add(link)
          link.sourceNode = node
        }
        if (link.targetId === id) {
          node.linksIn.add(link)
          link.targetNode = node
        }
      }
    }
    this.deferredLinks.delete(id)
  }

  private deferLink(nodeId: string, link: Link) {
    const {deferredLinks} = this
    const existing = deferredLinks.get(nodeId)
    if (existing) { existing.push(link); return }
    const created = [link]
    deferredLinks.set(nodeId, created)
  }

  private deferredLinks = new Map<string, Link[]>()
}

const theAtlas = new Atlas
export default theAtlas

Object.assign(window, { Atlas: theAtlas })
