import { entryService } from 'services/entry'
import { activityLogService } from 'services/activity-log'

const { findById, findByDate, findAll, create, update } = entryService()

export default {
  Query: {
    findEntryById: async (_, { id }, context) => {
      return await findById(id)
    },
    findEntryByDate: async (_, { titleDate }, context) => {
      return await findByDate(titleDate)
    },
    findAllEntries: async (_, { user }, context) => {
      return await findAll(user)
    },
  },
  Mutation: {
    createEntry: async (_, { titleDate, content }, context) => {
      return await create(titleDate, content)
    },
    updateEntry:  async (_, { id, content }, context) => {
      return await update(id, content)
    },
  },
  /* Entry: {
   *   activityLogs: (entry, {}, context) => {
   *     return entry.activityLogs
   *   }
   * }, */
}
