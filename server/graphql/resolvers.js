import path from 'path'
import { GraphQLScalarType } from 'graphql'
import { mergeResolvers } from '@graphql-tools/merge'

import userResolvers from './resolvers/user'
import entryResolvers from './resolvers/entry'
import activityLogResolvers from './resolvers/activity-log'


const dateTimeResolver = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A date and time, represented as an ISO-8601 string',
    // serialize: prepares a queried value from the server to be sent to the client
    serialize: (value) => value.toISOString(),
    // parseValue: prepares a query object
    // parseLiteral: prepares an inline query to be sent to the server
    parseValue: (value) => value,
    parseLiteral: (ast) => ast.value
  })
}

const jsonResolver = {
  JSONObject: new GraphQLScalarType({
    name: 'JSONObject',
    description: 'A javascript JSON string',
    /* serialize: (value) => JSON.parse(value), */
    serialize: (value) => value,
    /* parseValue: (value) => JSON.stringify(value), */
    parseValue: (value) => value,
    /* parseLiteral: (ast) => JSON.stringify(ast.value) */
    parseLiteral: (ast) => ast.value
  })
}

const resolversArray = [dateTimeResolver,
                        jsonResolver,
                        userResolvers,
                        entryResolvers,
                        activityLogResolvers]

export default mergeResolvers(resolversArray)
