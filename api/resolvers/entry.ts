import { IResolvers } from 'graphql-tools'
import { authenticate } from '../actions/auth'
import {
  findById,
  findByDate,
  findByDateSpan,
  findAll,
  // create,
  // update,
  createOrUpdate,
} from '../actions/entry'
import { findAll as findEntryLogs } from '../actions/activity-log'
import { findById as findEntryOwner } from '../actions/user'
import { Entry, User, ActivityLog } from 'shared/types'
// import { CreateEntryInput, UpdateEntryInput, EditorInput } from 'shared/types/editor'
import { EditorInput } from 'shared/types/editor'
import Ctx from '../context'

const EntryResolvers: IResolvers = {
  Query: {
    findEntryById: authenticate(
      async (_, { id }: Pick<Entry, 'id'>, ctx: Ctx): Promise<Entry> => {
        return await findById(ctx.user.id, id)
      }
    ),
    findEntryByDate: authenticate(
      async (_, args: Pick<Entry, 'date'>, ctx: Ctx) => {
        console.log('RESOLVERS -> ENTRY -> FIND BY DATE ->')
        return await findByDate(ctx.user.id, args.date)
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
    findEntriesByDates: authenticate(async (_, { dateSpan }, ctx: Ctx) => {
      return await findByDateSpan(ctx.user.id, dateSpan)
    }),
    findAllEntries: authenticate(async (_, {}, ctx: Ctx) => {
      return await findAll(ctx.user.id)
    }),
  },
  Mutation: {
    // createEntry: authenticate(async (_, args: CreateEntryInput, ctx: Ctx) => {
    //   console.log('RESOLVERS -> ENTRY -> FIND OR CREATE ->')
    //   return await createEntry(ctx.user.id, ...args)
    // }),
    // updateEntry: authenticate(async (_, args: UpdateEntryInput, ctx: Ctx) => {
    //   console.log('RESOLVERS -> ENTRY -> UPDATE ->')
    //   return await update(ctx.user.id, ...args)
    // }),
    createOrUpdateEntry: authenticate(
      async (_, args: EditorInput, ctx: Ctx): Promise<Entry> => {
        console.log('RESOLVERS -> ENTRY -> CREATE OR UPDATE ->')
        // return args.id
        //   ? await update(ctx.user.id, args)
        //   : await create(ctx.user.id, args)
        args.userId = ctx.user.id
        return await createOrUpdate(args)
      }
    ),
  },
  Entry: {
    user: async (entry, {}, ctx: Ctx) => {
      return await findEntryOwner(entry.userId)
    },
    activityLogs: async (entry, {}, ctx: Ctx) => {
      return findEntryLogs(entry.id)
    },
  },
}

export default EntryResolvers
