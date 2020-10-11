import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import userTypes from './types/User.graphql'
import entryTypes from './types/Entry.graphql'

import activityLogTypes from './types/ActivityLog.graphql'
console.log(userTypes)

/* const typesArray = loadFilesSync(path.join(__dirname, './types')) */

const typesArray = [userTypes, entryTypes, activityLogTypes]

export default mergeTypeDefs(typesArray)
