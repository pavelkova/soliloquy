import { IResolvers } from 'graphql-tools'
import { authenticate } from '../actions/auth'
import {
  findById,
  findByDate,
  findByDateSpan,
  findAll,
  create,
  update,
  createOrUpdate,
} from '../actions/entry'
import { findAll as findEntryLogs } from '../actions/activity-log'
import { findById as findEntryOwner } from '../actions/user'
import { Entry, User, ActivityLog } from 'shared/types'
import {
  CreateEntryInput,
  UpdateEntryInput,
  EntryInput,
} from 'shared/types/editor'
// import { EntryInput } from 'shared/types/editor'
import Ctx from '../context'

const EntryResolvers: IResolvers = {
  Query: {
    findEntryById: authenticate(
      async (_, { id }: Pick<Entry, 'id'>, ctx: Ctx): Promise<Entry> => {
        return await findById(ctx.user.id, id)
      }
    ),
    findEntryByDate: authenticate(
      async (_, args: Pick<Entry, 'date'>, ctx: Ctx): Promise<Entry> => {
        console.log('RESOLVERS -> ENTRY -> FIND BY DATE ->')
        // return await findByDate(ctx.user.id, args.date)
          const entry = await findByDate(ctx.user.id, args.date)
          console.log(entry)
          return entry
      }
    ),
    // findEntriesByMonth: authenticate(
    //   async (_, { dateSpan }, ctx) => {
    //     return await findByDateSpan(ctx.user.id, dateSpan)
    // }),
    // findEntriesByYear: authenticate(
    //   async (_, { dateSpan }, ctx) => {
    //     return await findByDateSpan(ctx.user.id, dateSpan)
    // }),
    findEntriesByDates: authenticate(async (_, { dateSpan }, ctx: Ctx): Promise<
      Entry[]
    > => {
      return await findByDateSpan(ctx.user.id, dateSpan)
    }),
    findAllEntries: authenticate(async (_, {}, ctx: Ctx): Promise<Entry[]> => {
      return await findAll(ctx.user.id)
    }),
  },
  Mutation: {
    createEntry: authenticate(
      async (_, args: CreateEntryInput, ctx: Ctx): Promise<Entry> => {
        console.log('RESOLVERS -> ENTRY -> CREATE ->')
        return await create(ctx.user.id, ...args)
      }
    ),
    updateEntry: authenticate(
      async (_, args: UpdateEntryInput, ctx: Ctx): Promise<Entry> => {
        console.log('RESOLVERS -> ENTRY -> UPDATE ->')
        return await update(ctx.user.id, ...args)
      }
    ),
    createOrUpdateEntry: authenticate(
      async (_, args: EntryInput, ctx: Ctx): Promise<Entry> => {
        console.log('RESOLVERS -> ENTRY -> CREATE OR UPDATE ->')
        return await createOrUpdate({ userId: ctx.user.id, ...args })
      }
    ),
  },
  Entry: {
    user: async (entry, {}, ctx: Ctx): Promise<User> => {
      return await findEntryOwner(entry.userId)
    },
    activityLogs: async (entry, {}, ctx: Ctx): Promise<ActivityLog[]> => {
      return findEntryLogs(entry.id)
    },
  },
}

export default EntryResolvers
