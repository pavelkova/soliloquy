import { authenticate } from 'services/auth'
import { findToday, findById, findByDate, findByDateSpan, findAll,
         create, update } from 'actions/entry'
import { findAll as findEntryLogs } from 'actions/activity-log'
import { findById as findEntryOwner } from 'actions/user'

export default {
  Query: {
    findToday: authenticate(
      async (_, {}, ctx) => {
        return await findToday(ctx.user)
    }),
    findEntryById: authenticate(
      async (_, { id }, ctx) => {
        return await findById(ctx.user, id)
    }),
    findEntryByDate: authenticate(
      async (_, { date }, ctx) => {
        return await findByDate(ctx.user, date)
    }),
    findEntriesByDates: authenticate(
      async (_, { fromDate, toDate }, ctx) => {
        return await findByDateSpan(ctx.user, fromDate, toDate)
    }),
    findAllEntries: authenticate(
      async (_, {}, ctx) => {
        return await findAll(ctx.user)
    }),
  },
  Mutation: {
    findOrCreateEntry: authenticate(
      async (_, { timezone }, ctx) => {
        return await create(ctx.user, timezone)
    }),
    updateEntry:  authenticate(
      async (_, { id, content, wordCount, activity }, ctx) => {
        return await update(ctx.user, id, content, wordCount, activity )
    }),
  },
  Entry: {
    user: async (entry, {}, ctx) => {
      return await findEntryOwner(entry.userId)
    },
    activityLogs: async (entry, {}, ctx) => {
      return findEntryLogs(entry.id)
    }
  },
}
