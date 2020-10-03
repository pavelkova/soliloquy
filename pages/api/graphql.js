import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlHTTP } from 'express-graphql'
import nc from 'next-connect'
import resolvers from '../../graphql/resolvers'
import typeDefs from '../../graphql/type-defs'

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

console.log(resolvers)
console.log(typeDefs)
/* console.log(schema) */

export default nc()
    .use('/api/graphql',
          graphqlHTTP({
              schema: schema,
              graphiql: true
    }))
