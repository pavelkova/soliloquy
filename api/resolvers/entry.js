import { authenticate } from '../actions/auth'
import { findById, findByDate, findByDateSpan, findAll,
         create, update } from '../actions/entry'
import { findAll as findEntryLogs } from '../actions/activity-log'
import { findById as findEntryOwner } from '../actions/user'
import { formatEntryDate } from 'utils/date'

export default {
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
    findOrCreateToday: authenticate(
      async (_, { }, ctx) => {
        console.log('RESOLVERS -> ENTRY -> FIND OR CREATE ->')
        const today = formatEntryDate(ctx.user.tz)

        const entry = await findByDate(ctx.user, today)
        console.log(entry)

        return entry ?? await create(ctx.user, today)
    }),
    createEntry: authenticate(
      async (_, { date }, ctx) => {
        console.log('RESOLVERS -> ENTRY -> CREATE ->')
        return await create(ctx.user, date)
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

const findOrCreate = async (user, date) => {
  console.log('ACTIONS -> ENTRY -> FIND OR CREATE TODAY ->')

  const entry = await findByDate(user, date)

  return entry ?? await create(user, date)
}
