import { IResolvers } from 'graphql-tools'
import { authenticate } from '../actions/auth'
import { findById, findByDate, findByDateSpan, findAll,
         create, update } from '../actions/entry'
import { findAll as findEntryLogs } from '../actions/activity-log'
import { findById as findEntryOwner } from '../actions/user'

const EntryResolvers: IResolvers = {
  Query: {
    findEntryById: authenticate(
      async (_, { id }, ctx) => {
        return await findById(ctx.user, id)
    }),
    findEntryByDate: authenticate(
      async (_, { date }, ctx) => {
        console.log('RESOLVERS -> ENTRY -> FIND BY DATE ->')
        return await findByDate(ctx.user, date)
    }),
    findEntriesByDates: authenticate(
      async (_, { dateSpan }, ctx) => {
        return await findByDateSpan(ctx.user, dateSpan)
    }),
    findAllEntries: authenticate(
      async (_, {}, ctx) => {
        return await findAll(ctx.user)
    }),
  },
  Mutation: {
    findOrCreateEntry: authenticate(
      async (_, { date, timezone }, ctx) => {
        console.log('RESOLVERS -> ENTRY -> FIND OR CREATE ->')
        const entry = await findByDate(ctx.user, date)
        return entry ?? await create(ctx.user, date, timezone)
    }),
    updateEntry:  authenticate(
      async (_, { id, content, wordCount, activity }, ctx) => {
        console.log('RESOLVERS -> ENTRY -> UPDATE ->')
        return await update(ctx.user, id, content, wordCount, activity)
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

export default EntryResolvers
