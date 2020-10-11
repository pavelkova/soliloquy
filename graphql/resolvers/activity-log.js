import { activityLogService } from 'services/activity-log'

const { findLogById, findAllLogs, createLog, updateLog } = activityLogService()

export default {
  Query: {
    findActivityLogById: async (_, { id }, context) => {
      return await findLogById(id)
    },
    findAllActivityLogs: async (_, { entry }, context) => {
      return await findAllLogs(entry)
    }
  },
  Mutation: {
    createActivityLog: async (_, { entry, content, startTime, endTime }, context) => {
      return await createLog(entry, content, startTime, endTime)
    },
    updateActivityLog: async (_, { id, content }, context) => {
      return await updateLog(id, content, startTime, endTime)
    }
  }
}
