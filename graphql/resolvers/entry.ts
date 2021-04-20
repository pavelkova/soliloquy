import { IResolvers } from 'graphql-tools'
import { authenticate } from '../actions/auth'
import { findById, findByDate, findByDateSpan, findAll,
         create, update } from '../actions/entry'
import { findAll as findEntryLogs } from '../actions/activity-log'
import { findById as findEntryOwner } from '../actions/user'
import { Entry, User, ActivityLog } from 'shared/types'
import Ctx from '../context'

const EntryResolvers: IResolvers = {
  Query: {
    findEntryById: authenticate(
      async (_, { id }: Pick<Entry, 'id'>, ctx: Ctx) => {
        return await findById(ctx.user.id, id)
    }),
    findEntryByDate: authenticate(
      async (_, args: Pick<Entry, 'date'>, ctx: Ctx) => {
        console.log('RESOLVERS -> ENTRY -> FIND BY DATE ->')
        return await findByDate(ctx.user.id, args.date)
    }),
    // findEntriesByMonth: authenticate(
    //   async (_, { dateSpan }, ctx) => {
    //     return await findByDateSpan(ctx.user.id, dateSpan)
    // }),
  // findEntriesByYear: authenticate(
    //   async (_, { dateSpan }, ctx) => {
    //     return await findByDateSpan(ctx.user.id, dateSpan)
    // }),
    findEntriesByDates: authenticate(
      async (_, { dateSpan }, ctx: Ctx) => {
        return await findByDateSpan(ctx.user.id, dateSpan)
    }),
    findAllEntries: authenticate(
      async (_, {}, ctx: Ctx) => {
        return await findAll(ctx.user.id)
    }),
  },
  Mutation: {
    findOrCreateEntry: authenticate(
      async (_, args: Pick<Entry, 'date' | 'timezone'>, ctx: Ctx) => {
        console.log('RESOLVERS -> ENTRY -> FIND OR CREATE ->')
        const entry = await findByDate(ctx.user.id, args.date)
        return entry ?? await create(ctx.user.id,
                                     args.date,
                                     args.timezone)
    }),
    updateEntry:  authenticate(
      async (_, { id, content, wordCount, activity }, ctx: Ctx) => {
        console.log('RESOLVERS -> ENTRY -> UPDATE ->')
        return await update(ctx.user.id, id, content, wordCount, activity)
    }),
  },
  Entry: {
    user: async (entry, {}, ctx: Ctx) => {
      return await findEntryOwner(entry.userId)
    },
    activityLogs: async (entry, {}, ctx: Ctx) => {
      return findEntryLogs(entry.id)
    }
  },
}

export default EntryResolvers
