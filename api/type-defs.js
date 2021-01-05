import path from 'path'
import { mergeTypeDefs } from '@graphql-tools/merge'

import userTypes from './types/User.graphql'
import entryTypes from './types/Entry.graphql'
import activityLogTypes from './types/ActivityLog.graphql'

const dateTimeType = `scalar DateTime`
const jsonType = `scalar JSONObject`

const typesArray = [dateTimeType,
                    jsonType,
                    userTypes,
                    entryTypes,
                    activityLogTypes]

export default mergeTypeDefs(typesArray)
