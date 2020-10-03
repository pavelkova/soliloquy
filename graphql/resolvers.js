import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
import authResolver from './resolvers/auth'

/* const resolversArray = loadFilesSync(path.join(__dirname, './resolvers')) */

const resolversArray = [authResolver]
export default mergeResolvers(resolversArray)
