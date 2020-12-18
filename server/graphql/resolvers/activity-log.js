import { findById, findAll } from 'actions/activity-log'

export default {
  Query: {
    findActivityLogById: async (_, { id }, ctx) => {
      return await findById(id)
    },
    findAllActivityLogs: async (_, { entryId }, ctx) => {
      return await findAll(entryId)
    }
  }
}
