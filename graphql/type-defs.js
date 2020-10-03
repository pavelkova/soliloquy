import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import userTypes from './types/User.graphql'

/* const typesArray = loadFilesSync(path.join(__dirname, './types')) */

const typesArray = [userTypes]
export default mergeTypeDefs(typesArray)
