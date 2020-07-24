-- introConstellation --

hi, i'm ashi krishnan, i work at apollo, and i'm here to talk about project constellation.

project constellation covers a number of initiatives inside apollo. for now, think of it as the next version of federation. we're aiming to make it easier for you to weave together data graphs and end up with exactly the data you need, in exactly the shape you need it. that's the promise of graphql.

first, let's look at the state of graphql and federation today.

-- introFederation --

graphql gives us a common language to describe all the data available through an API. say we're an organization who launches people into space. we'll presumably have a database tracking who we have launched (or will launch) into space. and then we'll write a graphql schema to expose that data for our website where you can see who we've launched into space. the graphql schema might look like this:

```graphql
  type Query {
    launches: [Launch!]!
    astronaut(byName: String!): Astronaut
    missions: [Mission!]!
    ships: [Ship!]!
    me: Astronaut
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    ship: Ship
    astronauts: [Astronaut]!
  }
  
  type Ship {
    id: ID!
    name: String
    type: String
  }
 
  type Astronaut {
    id: ID!  
    name: String!    
    trips: [Launch]!
  }
  
  type Mission {
    name: String
    viableShips: [Ship!]!
  }
```

this looks like a tree, but when we parse it, we can see that it creates a structure with cross-links—that is, it gets linked into a graph.

[ SHOW: parsed graph ]

in this graph, types are nodes—they are places you can *be*. fields are edges—they are ways you can *move*. resolvers teach us *how to walk along an edge*.

[ BEGIN: animate movement along edges ]

so if you're standing on an `Astronaut` and want their name, the `Astronaut.name` resolver knows how to get you there.

[ HIGHLIGHT: Astronaut.name ]

!! TK: Query

if we didn't have graphql, we would still be able to expose this data. we'd just have to come up with our own interface to request it—maybe some RESTful api. 

but graphql gives us a common language for expressing our schema. that common language makes it easier to get data out of graphql endpoints. it also means that endpoints can be merged together and treated as a single graph.

after we've been launching people into space for a while, we notice that most of the people who want to go to space are sci-fi fans, so we want to roll out a feature where we track what folks are reading and use it to inspire future missions. this project is run by a separate team, so they produce a separate graph:

```graphql
type Query {
  books(forAstronaut: ID!): [Book]
}

type Book {
  title: String
  author: Author
  themes: [String!]
}

type Author {
  name: String
  books: [Book!]
}
```

Federation lets us glue these graphs together. Say we want to find out all the books Sally has been reading. If we federate these graphs exactly as is, we might do something like this to get that data.

```graphql
query {
  astronaut(byName: "Sally") { id }
}

query {
  books(forAstronaut: $id) { title }
}
```

We have to make two queries, and we have to manually shuttle the astronaut's id from the first query response into the second query's variables, which isn't ideal. We can fix this with some federation directives:

```graphql
extend type Astronaut @key(fields: "id") {
  books: [Book]
}
```

Then, we also have to implement `__entities` on our books service so we can hydrate an Astronaut object from an astronaut's ID.

After we've done that, we can write the query we want:

```graphql
query {
  astronaut(byName: "Sally") {
    books { title }
  }
}
```

this works great: the federation gateway now knows how to go fetch the books for any astronaut. sadly, we had to write some code to make that happen: the new `__entities` resolver. this is a little frustrating, because our original set of resolvers is actually capable of answering our query—we just need a way to express the data flow.

!!TK: what if we didn't control the books service?

!!TK: more here about how cool Federation is: you can now write graphs as units and describe how they connect with federation primitives, which means more people can write graphs, which means the size of graphs is growing tremendously (TK: data?)

!!TK: as data size grows, new questions emerge:
  - goal of graphql: provide data as the frontend needs it
  - how do I do that if I don't necessarily control all the pieces of the graph?
  - constellation's answer: you do!
    - a word about schema stitching
    - schema stitching brought you speed and flexibility, federation brings static type safety
    - constellation is an effort to unify the two and get you that triumverate: speed, type safety, and flexibility

"some of the features of constellation that we're most excited about that'll help you keep up with your graph as it grows"

this is where project constellation comes in: our aim is to provide some new tools that make it easier to combine graphs however you want. one of the new constellation tools is *resolver assignment*.

with resolver assignment, we can write our schema like so:

```graphql
extend type Astronaut {
  id: ID! @external
  books: [Book] @from(query: "Query.books(forAstronaut: id)")
}
```

```graphql
extend type Astronaut {
  id: ID! @external
  books: [Book] = http.get(url: `https://api.books.com/books?astronautId=${id}`)
}
```

!!TK --
  - how this works: updating the query planner (3min)
    - rewriting qp in rust
      - improve execution speed
      - "js is a great way to build apps, but we see the planner and gateway as core infrastructure for the data graph, so we wanted to move to a systems language"
  - new features (5min)
    - design goals:
      - full compaitibility w federation and existing graphql clients
      - implication: no new language features (but...)
      - performance at enterprise scale
      - local development & static analysis
    - @from, assignment operator
    - type composition with schema spread
    - all of your data, one graph
  - whaaa? new syntax? is it standard?
    - compiles locally down to graphql
    - schema compiler
      - adding a compiler step which you control, gives you more flexibility
      - reasons you might want to implement `__entities` even if you don't have to
  - federating across organizations (hint at the public atlas) (5min)
    - connecting to partner graphs
    - deep example: add another graph, do a more complex stitch
  - from federation today to tomorrow (2min)
    - adopt federation today, so you can get this tomorrow
  
  "a booster pack for existing investments"
