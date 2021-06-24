import { IResolvers } from 'graphql-tools'
import { authenticate } from '../actions/auth'
import { findById, findAll } from '../actions/activity-log'
import { findById as findLogOwner } from '../actions/entry'
import {
  ActivityLogInput,
  CreateLogInput,
  UpdateLogInput,
} from 'shared/types/editor'
import { Entry, User, ActivityLog } from 'shared/types'
import Ctx from '../context'

const ActivityLogResolvers: IResolvers = {
  Query: {
    findActivityLogById: async (_, { id: number }, ctx) => {
      return await findById(id)
    },
    findAllActivityLogs: async (_, { entryId: number }, ctx) => {
      return await findAll(entryId)
    },
  },
  Mutation: {
    updateLog: async (
      _,
      args: UpdateLogInput,
      ctx: Ctx
    ): Promise<ActivityLog> => {
      console.log('RESOLVERS -> ACTIVITY LOG -> UPDATE ->')
      return await update(ctx.user.id, ...args)
    },
  },
  ActivityLog: {
    entry: async (activityLog, {}, ctx: Ctx): Promise<Entry> => {
      return await findLogOwner(activityLog.entryId)
    },
  },
}

export default ActivityLogResolvers
