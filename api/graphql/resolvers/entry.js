import { authenticate } from 'services/auth'
import { findById, findByDate, findAll,
         create, update } from 'actions/entry'
import { findAll as findEntryLogs } from 'actions/activity-log'
import { findById as findEntryOwner } from 'actions/user'

export default {
  Query: {
    findEntryById: authenticate(
      async (_, { id }, ctx) => {
        return await findById(ctx.user, id)
    }),
    findEntriesByDate: authenticate(
      async (_, { yyyy, mm, dd }, ctx) => {
        return await findByDate(ctx.user,
                                { yyyy, mm, dd })
    }),
    findAllEntries: authenticate(
      async (_, {}, ctx) => {
        return await findAll(ctx.user)
    }),
  },
  Mutation: {
    createEntry: authenticate(
      async (_, {}, ctx) => {
        return await create(ctx.user)
    }),
    updateEntry:  authenticate(
      async (_, { content, wordCount, id }, ctx) => {
        return await update(ctx.user, content, wordCount)
    }),
  },
  Entry: {
    user: async (entry, {}, ctx) => {
      return await findEntryOwner(entry.userId)
    },
    activityLogs: async (entry, {}, ctc) => {
      return findEntryLogs(entry)
    }
  },
}
