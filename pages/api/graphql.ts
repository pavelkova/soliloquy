import { NextApiRequest, NextApiResponse } from 'next'
import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlHTTP } from 'express-graphql'
import nc from 'next-connect'
import resolvers from 'api/resolvers'
import typeDefs from 'api/type-defs'
import { getUserToken } from 'api/actions/auth'

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default nc<NextApiRequest, NextApiResponse>().use(
  /* '192.168.1.13:3000/api/graphql', */
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
