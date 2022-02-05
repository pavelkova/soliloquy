import { IResolvers } from 'graphql-tools'

const authenticate = resolver => (_parent, _args, ctx) => {
    if (ctx?.user) {
        return resolver(_parent, _args, ctx)
    }
    throw new Error('Not authenticated')
}

const resolvers: IResolvers = {
    Query: {
        findEntryByDate: authenticate(async (_parent, args, ctx) => {
            return ctx.prisma.entry.findUnique({
                where: {
                    date: args.date,
                    User: {
                        id: ctx.user.id
                    }
                }
            })
        }),
        findEntriesByDateSpan: authenticate(async (_parent, args, ctx) => {
            return ctx.prisma.entry.findMany({
                where: {
                    User: {
                        id: ctx.user.id
                    }
                }
            })
        }),
        findAllEntries: authenticate(async (_parent, args, ctx) => {
            return ctx.prisma.entry.findMany({
                where: {
                    User: {
                        id: ctx.user.id
                    }
                }
            })
        }),
        findAllTags: authenticate(async (_parent, _args, ctx) => {
            return ctx.prisma.tags.findMany({
                where: {
                    User: {
                        id: ctx.user.id
                    }
                }
            })
        }),
    },
    Mutation: {
        signup: async (_parent, args, ctx) => {
            return ctx.prisma.user.create({
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
            return
        }),
        createOrUpdateEntry: authenticate(async (_parent, args, ctx) => {
            return
        }),
        createOrUpdateLog: authenticate(async (_parent, args, ctx) => {
            return
        }),
        createTag: authenticate(async (_parent, args, ctx) => {
            return
        }),
        updateTag: authenticate(async (_parent, args, ctx) => {
            return
        }),
        deleteTag: authenticate(async (_parent, args, ctx) => {
            return ctx.prisma.tag.delete({
                where: {
                    id: args.id,
                    User: {
                        id: ctx.usr.id
                    }
                }
            })
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
