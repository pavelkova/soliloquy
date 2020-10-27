import path from 'path'
import { mergeTypeDefs } from '@graphql-tools/merge'

import userTypes from './types/User.graphql'
import entryTypes from './types/Entry.graphql'
import settingTypes from './types/Setting.graphql'
import activityLogTypes from './types/ActivityLog.graphql'

const dateTimeType = `scalar DateTime`

const typesArray = [dateTimeType,
                    userTypes,
                    entryTypes,
                    settingTypes,
                    activityLogTypes]

export default mergeTypeDefs(typesArray)
