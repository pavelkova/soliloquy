import { findById, findAll,
         create, update } from 'actions/activity-log'

export default {
  Query: {
    findActivityLogById: async (_, { id }, ctx) => {
      return await findById(id)
    },
    findAllActivityLogs: async (_, { entry }, ctx) => {
      return await findAll(entry)
    }
  },
  Mutation: {
    createActivityLog: async (_, { entry, content, startTime, endTime }, ctx) => {
      return await create(entry, content, startTime, endTime)
    },
    updateActivityLog: async (_, { id, content }, ctx) => {
      return await update(id, content, startTime, endTime)
    }
  }
}
