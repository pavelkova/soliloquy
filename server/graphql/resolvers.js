import path from 'path'
import { GraphQLScalarType } from 'graphql'
import { mergeResolvers } from '@graphql-tools/merge'

import userResolvers from './resolvers/user'
import entryResolvers from './resolvers/entry'
import activityLogResolvers from './resolvers/activity-log'
import settingResolvers from './resolvers/setting'


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

const resolversArray = [dateTimeResolver,
                        userResolvers,
                        entryResolvers,
                        activityLogResolvers,
                        settingResolvers]

export default mergeResolvers(resolversArray)
