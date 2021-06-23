import { IResolvers } from 'graphql-tools'
import { findById, findAll } from '../actions/activity-log'



const ActivityLogResolvers: IResolvers = {
  Query: {
      findActivityLogById: async (_, { id: number }, ctx) => {
      return await findById(id)
    },
      findAllActivityLogs: async (_, { entryId: number }, ctx) => {
      return await findAll(entryId)
    }
  },
    Mutation: {
    updateEntry: authenticate(
      async (_, args: UpdateEntryInput, ctx: Ctx): Promise<Entry> => {
        console.log('RESOLVERS -> ENTRY -> UPDATE ->')
        return await update(ctx.user.id, ...args)
      }
    ),
    },
    ActivityLog: {
    user: async (entry, {}, ctx: Ctx): Promise<User> => {
      return await findEntryOwner(entry.userId)
    },
    }
}

export default ActivityLogResolvers
