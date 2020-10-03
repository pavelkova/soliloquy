import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlHTTP } from 'express-graphql'
import nc from 'next-connect'
import resolvers from 'graphql/resolvers'
import typeDefs from 'graphql/type-defs'

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

export default nc()
    .use('/api/graphql',
          graphqlHTTP({
              schema: schema,
              graphiql: true
    }))
    .get((req, res) => {
        res.send('hello')
    })
    .post((req, res) => {
    })
    .put(async (req, res) => {
    })
    .path(async (req, res) => {
    })
