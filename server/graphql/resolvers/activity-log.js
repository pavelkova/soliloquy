import { findById, findAll,
         create, update } from 'actions/activity-log'

export default {
  Query: {
    findActivityLogById: async (_, { id }, ctx) => {
      return await findById(id)
    },
    findAllActivityLogs: async (_, { entryId }, ctx) => {
      return await findAll(entryId)
    }
  },
  Mutation: {
    createActivityLog: async (_, { entryId, start, end, content }, ctx) => {
      return await create(entryId, start, end, content)
    },
    updateActivityLog: async (_, { id, content, start, end }, ctx) => {
      return await update(id, start, end, content)
    }
  }
}
