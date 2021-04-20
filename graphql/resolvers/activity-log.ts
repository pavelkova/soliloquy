import { IResolvers } from 'graphql-tools'
import { findById, findAll } from '../actions/activity-log'



const ActivityLogResolvers: IResolvers = {
  Query: {
    findActivityLogById: async (_, { id }, ctx) => {
      return await findById(id)
    },
    findAllActivityLogs: async (_, { entryId }, ctx) => {
      return await findAll(entryId)
    }
  }
}

export default ActivityLogResolvers
