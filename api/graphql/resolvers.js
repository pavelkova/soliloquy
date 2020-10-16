import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
import userResolvers from './resolvers/user'
import entryResolvers from './resolvers/entry'
import activityLogResolvers from './resolvers/activity-log'
import settingResolvers from './resolvers/setting'

/* const resolversArray = loadFilesSync(path.join(__dirname, './resolvers')) */

const resolversArray = [userResolvers, entryResolvers, activityLogResolvers, settingResolvers]

export default mergeResolvers(resolversArray)
