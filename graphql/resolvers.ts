import { IResolvers } from 'graphql-tools'

const authenticate = resolver => (_parent, _args, ctx) => {
    if (ctx?.user) {
        return resolver(_parent, _args, ctx)
    }
    throw new Error('Not authenticated')
}

const resolvers: IResolvers = {
    Query: {
        findEntryByDate: authenticate(async (_, { date }, ctx) => {
            try {
                return await ctx.prisma.entry.findUnique({
                    where: {
                        date: date,
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
        findEntriesByDateSpan: authenticate(async (_, args, ctx) => {
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
        }),
        findAllEntries: authenticate(async (_, {}, ctx) => {
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
        }),
        findAllTags: authenticate(async (_, {}, ctx) => {
            try {
                return await ctx.prisma.tags.findMany({
                    where: {
                        User: {
                            id: ctx.user.id
                        }
                    }
                })
            } catch (e) {
            }
        }),
    },
    Mutation: {
        signup: async (_, { email, name, password, timezone}, ctx) => {
            const hashedPassword = password

            return await ctx.prisma.user.create({
                data: { ...args }
            })
        },
        login: async (_parent, args, ctx) => {
            return
        },
        logout: authenticate(async (_parent, _args, ctx) => {
            return
        }),
        updateUser: authenticate(async (_parent, args, ctx) => {
            return await ctx.prisma.user.update({
                where: {
                    id: ctx.user.id
                },
                data: { ...args }
            })
        }),
        createOrUpdateEntry: authenticate(async (_parent, { }, ctx) => {

            return
        }),
        createOrUpdateLog: authenticate(async (_parent, args, ctx) => {
            return
        }),
        createTag: authenticate(async (_parent, args, ctx) => {
            return await ctx.prisma.tag.create()
        }),
        updateTag: authenticate(async (_parent, args, ctx) => {
            return ctx.prisma.tag.update({
                where: {
                    id: args.id,
                    User: {
                        id: ctx.user.id
                    }
                },
                data: { ...args }
            })
        }),
        deleteTag: authenticate(async (_parent, args, ctx) => {
            return
        }),
        addTagToEntry: authenticate(async (_parent, args, ctx) => {
            return
        }),
        deleteTagFromEntry: authenticate(async (_parent, args, ctx) => {
            return
        })
    },
    User: {
        entries: {},
        tags: {}
    },
    Entry: {
        user: {},
        activityLogs: {},
        tags: {}
    },
    ActivityLog: {
        entry: {}
    },
    Tag: {
        user: {}
        parent: {},
        children: {},
        entries: {}
    }
}
