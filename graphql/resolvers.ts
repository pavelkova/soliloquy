import { IResolvers } from 'graphql-tools'

const authenticate = resolver => (_parent, _args, ctx) => {
    if (ctx?.user) {
        return resolver(_parent, _args, ctx)
    }
    throw new Error('Not authenticated')
}

interface User {
    id: string
    email: string
    name?: string
    password: string
    createdAt: Date
    updatedAt: Date
    settings: Settings
}

interface Settings {
}

interface Entry {
    id: string
    user: User
    date: string
    timezone: string
    createdAt: Date
    updatedAt: Date
    activityLogs?: ActivityLog[]
    tags?: Tag[]
}

interface ActivityLog {
    id: string
    entry: Entry
    content: string
    wordCount: number
    lowestWordCount: number
    createdAt: Date
    updatedAt: Date
}

interface Tag {
    id: string
    user: User
    name: string
    parent?: Tag
    children?: Tag[]
    createdAt: Date
    updatedAt: Date
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
            try {
                const hashedPassword = password
                return await ctx.prisma.user.create({
                    data: { ...args }
                })
            } catch (e) {
            }
        },
        login: async (_, args, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        logout: authenticate(async (_, _args, ctx) => {
            try {
                return
            } catch (e) {
            }
        }),
        updateUser: authenticate(async (_parent, args, ctx) => {
            return await ctx.prisma.user.update({
                where: {
                    id: ctx.user.id
                },
                data: { ...args }
            })
        }),
        createOrUpdateEntry: authenticate(async (_, { }, ctx) => {
            try {
                return
            } catch (e) {
            }
        }),
        createOrUpdateLog: authenticate(async (_, args, ctx) => {
            try {
                return
            } catch (e) {
            }
        }),
        createTag: authenticate(async (_, args, ctx) => {
            try {
                return
            } catch (e) {
            }
            return await ctx.prisma.tag.create()
        }),
        updateTag: authenticate(async (_, args, ctx) => {
            try {
                return
            } catch (e) {
            }
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
        deleteTag: authenticate(async (_, args, ctx) => {
            try {
                return
            } catch (e) {
            }
        }),
        addTagToEntry: authenticate(async (_, args, ctx) => {
            try {
                return
            } catch (e) {
            }
        }),
        deleteTagFromEntry: authenticate(async (_, args, ctx) => {
            try {
                return
            } catch (e) {
            }
        })
    },
    User: {
        entries: async (user, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        tags: async (user, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
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
    },
    ActivityLog: {
        entry: async (activityLog, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
    },
    Tag: {
        user: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        parent: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        children: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        },
        entries: async (tag, {}, ctx) => {
            try {
                return
            } catch (e) {
            }
        }
    }
}
