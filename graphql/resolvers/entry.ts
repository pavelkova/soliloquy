import { IResolvers } from 'graphql-tools'
import { ActivityLog, Entry, Tag } from 'shared/types'
import { authenticate } from './helpers/auth'

const resolvers: IResolvers = {
    Query: {
        findEntryByDate: authenticate(async (_, { date }: { date: string }, ctx): Promise<Entry> => {
            try {
                return await ctx.prisma.entry.findUnique({
                    where: {
                        date,
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
        findEntriesByDateSpan: authenticate(async (_, args, ctx): Promise<Entry[]> => {
            try {
                // TODO ref prisma documentation for date queries
                return await ctx.prisma.entry.findMany({
                    where: {
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
        findAllEntries: authenticate(async (_, {}, ctx): Promise<Entry[]> => {
            try {
                return await ctx.prisma.entry.findMany({
                    where: {
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        })
    },
    Mutation: {
        findOrCreateEntry: authenticate(async (_, args: { date: string, timezone: string }, ctx): Promise<Entry> => {
            // FIXME  ugly conditional
            try {
                const entry = await ctx.prisma.entry.findUnique({
                    where: {
                        date: args.date,
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
                if (!entry) {
                    return await ctx.prisma.entry.create({ data: {
                        date: args.date,
                        timezone: args.timezone,
                        User: {
                            id: ctx.user.id
                        }
                    }})
                }
                return entry
            } catch (e) {
            }
        }),
        // TEST -- to replace all log and entry create/update functions

        createOrUpdateEntry: authenticate(async (_, { date, timezone, activity }, ctx): Promise<Entry> => {
            try {
                const entry = ctx.prisma.entry.upsert({
                    where: {
                        date,
                        userId: ctx.user.id
                    },
                    update: {
                        timezone,
                        dayEndsAt: ctx.user.settings.dayEndsAt,
                        updatedAt: Date.now()
                    },
                    create: {
                        date,
                        timezone,
                        dayEndsAt: ctx.user.settings.dayEndsAt,
                        userId: ctx.user.id
                    }
                })
                // TODO upsert activity log?
                return entry
            } catch (e) {
            }
        })
    },
    Entry: {
        user: async (entry, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        activityLogs: async (entry, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        tags: async (entry, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
    }
}
