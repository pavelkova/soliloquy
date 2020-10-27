import path from 'path'
import { GraphQLScalarType } from 'graphql'
import { mergeResolvers } from '@graphql-tools/merge'

import userResolvers from './resolvers/user'
import entryResolvers from './resolvers/entry'
import activityLogResolvers from './resolvers/activity-log'
import settingResolvers from './resolvers/setting'

const dateTimeResolver = { DateTime: new GraphQLScalarType(
  { name: 'DateTime',
    description: 'A date and time, represented as an ISO-8601 string',
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
  })
}

const resolversArray = [dateTimeResolver,
                        userResolvers,
                        entryResolvers,
                        activityLogResolvers,
                        settingResolvers]

export default mergeResolvers(resolversArray)
