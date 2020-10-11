import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlHTTP } from 'express-graphql'
import nc from 'next-connect'
import resolvers from 'gql/resolvers'
import typeDefs from 'gql/type-defs'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default nc().use(
  '/api/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context: {
      /* currentUser: user, */
    },
  })
)
