import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlHTTP } from 'express-graphql'
import nc from 'next-connect'
import resolvers from 'api/resolvers'
import typeDefs from 'api/type-defs'
import { getUserToken } from 'api/actions/auth'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default nc().use(
  '/api/graphql',
  graphqlHTTP(async (req, res) => ({
    schema,
    graphiql: {
      headerEditorEnabled: true,
    },
    context: {
      req,
      res,
      user: await getUserToken(req)
    },
  }))
)
