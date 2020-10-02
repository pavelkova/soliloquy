import knex from 'knex'
import knexfile from 'db/knexfile'
import schema from '../../graphql/schema.graphql'
import { graphqlHTTP } = require('express-graphql')

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
  }),
);

app.listen(4000);

export default nextConnect()
    .use('/api/graphql',
          graphqlHTTP({
              schema: MyGraphQLSchema,
              graphiql: true
    }))
